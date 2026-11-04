
import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { prisma } from "./db.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from server/.env");
}

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// ==================== VALIDATION ====================

const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(150),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  image: z.union([
    z.string().url().max(2000),
    z.literal(""),
    z.null(),
  ]).optional(),
});

const eventSchema = z.object({
  title: z.string().trim().min(4).max(120),
  description: z.string().trim().min(20).max(4000),
  category: z.string().trim().min(2).max(80),
  image: z.string().url(),
  location: z.string().trim().min(3).max(200),
  eventDate: z.string().refine(
    (value) =>
      !Number.isNaN(Date.parse(value)) &&
      new Date(value) > new Date(),
    "Event date must be in the future."
  ),
});

// ==================== HEALTH ====================

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Kindora API",
  });
});

// ==================== AUTHENTICATION ====================

// SIGNUP
app.post("/api/auth/signup", async (req, res, next) => {
  try {
    const data = signupSchema.parse(req.body);
    const email = data.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const email = data.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
});

// CURRENT USER
app.get("/api/auth/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// UPDATE PROFILE
app.patch("/api/auth/me", requireAuth, async (req, res, next) => {
  try {
    const data = profileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: data.name,
        ...(data.image !== undefined
          ? { image: data.image || null }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Profile updated successfully.",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// ==================== EVENTS ====================

// ALL UPCOMING EVENTS
app.get("/api/events", async (req, res, next) => {
  try {
    const requestedLimit = Number(req.query.limit);

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 50)
      : undefined;

    const events = await prisma.event.findMany({
      where: {
        eventDate: { gt: new Date() },
      },
      orderBy: { eventDate: "asc" },
      ...(limit ? { take: limit } : {}),
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
});

// SINGLE EVENT
app.get("/api/events/:id", async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: { joins: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

// CREATE EVENT
app.post("/api/events", requireAuth, async (req, res, next) => {
  try {
    const data = eventSchema.parse(req.body);

    const event = await prisma.event.create({
      data: {
        ...data,
        eventDate: new Date(data.eventDate),
        creatorId: req.user.id,
        creatorName: req.user.name,
        creatorEmail: req.user.email,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

// MY CREATED EVENTS
app.get("/api/my-events", requireAuth, async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        creatorId: req.user.id,
      },
      orderBy: { eventDate: "asc" },
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
});

// UPDATE EVENT
app.patch("/api/events/:id", requireAuth, async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    if (event.creatorId !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own events.",
      });
    }

    const data = eventSchema.partial().parse(req.body);

    const updatedEvent = await prisma.event.update({
      where: { id: event.id },
      data: {
        ...data,
        ...(data.eventDate
          ? { eventDate: new Date(data.eventDate) }
          : {}),
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

// DELETE EVENT
app.delete("/api/events/:id", requireAuth, async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    if (event.creatorId !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own events.",
      });
    }

    await prisma.event.delete({
      where: { id: event.id },
    });

    res.json({
      message: "Event deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

// JOIN EVENT
app.post("/api/events/:id/join", requireAuth, async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    if (event.eventDate <= new Date()) {
      return res.status(400).json({
        message: "This event has already passed.",
      });
    }

    const join = await prisma.eventJoin.create({
      data: {
        eventId: event.id,
        userId: req.user.id,
        userName: req.user.name,
        userEmail: req.user.email,
      },
    });

    res.status(201).json(join);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "You already joined this event.",
      });
    }

    next(error);
  }
});

// JOINED EVENTS
app.get("/api/joined-events", requireAuth, async (req, res, next) => {
  try {
    const joins = await prisma.eventJoin.findMany({
      where: { userId: req.user.id },
      include: { event: true },
      orderBy: {
        event: {
          eventDate: "asc",
        },
      },
    });

    res.json(
      joins.map((join) => ({
        ...join.event,
        joinedAt: join.joinedAt,
      }))
    );
  } catch (error) {
    next(error);
  }
});

// ==================== ERROR HANDLING ====================

app.use((error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      message: error.issues[0]?.message || "Invalid input.",
    });
  }

  console.error(error);

  res.status(500).json({
    message: "Something went wrong. Please try again.",
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`Kindora API listening on port ${PORT}`);
});

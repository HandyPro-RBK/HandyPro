

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getMessages = async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: parseInt(id),
      },
      include: {
        conversation: {
          include: {
            User: true,
            provider: true,
          },
        },
      },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    
    res
      .status(400)
      .json({ message: "Could not fetch messages", error: error.message });
  }
};

const getConversation = async (req, res) => {
  const { id } = req.params;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
      include: {
        messages: true,
        provider: true,
        user: true,
      },
    });
    if (conversation) {
      res.status(200).json(conversation);
    } else {
      res.status(404).json({ message: "Conversation not found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Could not fetch conversation", error: error.message });
  }
};

const getAllConversations = async (req, res) => {
  const { userId } = req.params; // Assume UserId is a path parameter

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ providerId: parseInt(userId) }, { UserId: parseInt(userId) }],
      },
      include: {
          provider: {
            select: {
              id: true,
              username: true,
              photoUrl: true
            }
          },
          User: {
            select: {
              id: true,
              username: true,
              photoUrl: true
            }
          },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          
        },
      },
    });

    if (conversations.length === 0) {
      return res.status(404).json({ message: "No conversations found" });
    }

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    res
      .status(500)
      .json({ message: "Error fetching conversations", error: error.message });
  }
};

module.exports = {
  getMessages,
  getConversation,
  getAllConversations,
};

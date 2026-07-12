import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS } from "../data/mockData";

const MarketplaceContext = createContext(undefined);

export const MarketplaceProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("nexcart-user-role") || "customer";
  });

  const handleSetUserRole = (role) => {
    setUserRole(role);
    localStorage.setItem("nexcart-user-role", role);
  };

  const [marketplaceProducts, setMarketplaceProducts] = useState(() => {
    const saved = localStorage.getItem("nexcart-marketplace-products");
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasSeeds = parsed.some(
        (p) => p.sellerType === "business" || p.sellerType === "individual",
      );
      if (hasSeeds) return parsed;
    }
    localStorage.setItem(
      "nexcart-marketplace-products",
      JSON.stringify(PRODUCTS),
    );
    return PRODUCTS;
  });

  const [businessProfile, setBusinessProfile] = useState(() => {
    const saved = localStorage.getItem("nexcart-business-profile");
    return saved
      ? JSON.parse(saved)
      : {
          companyName: "Stark Wholesale Systems",
          description:
            "Supplier of premium electronics, customized accessories, and high-performance laboratory equipment.",
          logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=60",
          verified: true,
          rating: 4.8,
          moq: 5,
          taxId: "TX-998822-S",
        };
  });

  const [quotes, setQuotes] = useState(() => {
    const saved = localStorage.getItem("nexcart-marketplace-quotes");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "q-101",
            productId: "biz-01",
            productName: "UltraCharge USB-C Bulk Bundle (50 Pack)",
            quantity: 10,
            pricePerUnit: 249,
            totalAmount: 2490,
            companyName: "Wayne Enterprise Tech",
            notes:
              "Requesting expedited freight shipping if possible. Please confirm timeline.",
            date: "2026-07-06",
            status: "pending",
          },
          {
            id: "q-102",
            productId: "biz-02",
            productName: "Helix Office Ergonomic Chair (Bulk Pallet)",
            quantity: 3,
            pricePerUnit: 1980,
            totalAmount: 5940,
            companyName: "Oscorp Offices Inc",
            notes:
              "Bulk order for second floor upgrade. Check if customizable dark mesh options are available.",
            date: "2026-07-04",
            status: "approved",
          },
        ];
  });

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("nexcart-marketplace-chats");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "chat-01",
            productId: "comm-01",
            productName: "Vintage Mechanical Keyboard (Custom Mod)",
            productImage:
              "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
            sellerName: "Marcus Vance",
            sellerType: "individual",
            online: true,
            typing: false,
            unread: true,
            messages: [
              {
                id: "m-1",
                sender: "seller",
                text: "Hello! Thanks for checking out the custom modded keyboard. Let me know if you have any questions.",
                timestamp: "10:15 AM",
              },
              {
                id: "m-2",
                sender: "buyer",
                text: "Hey! The build looks super clean. Is the price negotiable at all?",
                timestamp: "10:18 AM",
              },
              {
                id: "m-3",
                sender: "seller",
                text: "I can drop it slightly. Feel free to shoot me an offer.",
                timestamp: "10:19 AM",
              },
            ],
          },
        ];
  });

  const [activeChatId, setActiveChatId] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(
      "nexcart-marketplace-products",
      JSON.stringify(marketplaceProducts),
    );
  }, [marketplaceProducts]);

  useEffect(() => {
    localStorage.setItem(
      "nexcart-business-profile",
      JSON.stringify(businessProfile),
    );
  }, [businessProfile]);

  useEffect(() => {
    localStorage.setItem("nexcart-marketplace-quotes", JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem("nexcart-marketplace-chats", JSON.stringify(chats));
  }, [chats]);

  // Derived seller dashboard metrics
  const listingsOwnedByUser = marketplaceProducts.filter(
    (p) => p.sellerName === "Alex Stark",
  );
  const earnings = {
    total: listingsOwnedByUser
      .filter((p) => p.isSold)
      .reduce((acc, p) => acc + p.discountPrice, 0),
    sales: listingsOwnedByUser.filter((p) => p.isSold).length,
    activeListings: listingsOwnedByUser.filter((p) => !p.isSold).length,
    soldCount: listingsOwnedByUser.filter((p) => p.isSold).length,
  };

  const registerBusiness = (profile) => {
    setBusinessProfile((prev) => ({
      ...prev,
      ...profile,
      verified: true,
    }));
  };

  const updateBusinessSettings = (settings) => {
    setBusinessProfile((prev) => ({ ...prev, ...settings }));
  };

  const createListing = (listing) => {
    const defaultColor = { name: "Default Black", code: "#1e293b" };
    const newProduct = {
      id: `comm-user-${Date.now()}`,
      name: listing.name || "Untitled Listing",
      tagline: listing.tagline || "Freshly posted listing",
      description: listing.description || "",
      price: listing.price || 0,
      discountPrice: listing.discountPrice || listing.price || 0,
      discount:
        listing.price && listing.discountPrice
          ? Math.round(
              ((listing.price - listing.discountPrice) / listing.price) * 100,
            )
          : 0,
      rating: 5.0,
      reviewsCount: 0,
      category: listing.category || "accessories",
      parentCategory: listing.parentCategory || "electronics",
      images:
        listing.images && listing.images.length > 0
          ? listing.images
          : [
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
            ],
      threeSixtyImages:
        listing.images && listing.images.length > 0
          ? [listing.images[0]]
          : [
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
            ],
      colors: listing.colors || [defaultColor],
      sizes: listing.sizes,
      specifications: listing.specifications || {
        Location: listing.location || "Online",
      },
      features: listing.features || ["Verified Seller Guarantee"],
      stock: listing.stock || 1,
      freeDelivery: listing.freeDelivery || false,
      estimatedDelivery: "2-4 days",
      returnPolicy: listing.returnPolicy || "All sales final",
      brand: listing.brand || "Independent",
      sellerType: listing.sellerType || "individual",
      sellerName: "Alex Stark", // Signed in user
      sellerRating: 5.0,
      sellerVerified: true,
      condition: listing.condition || "New",
      negotiable: listing.negotiable ?? true,
      location: listing.location || "San Francisco, CA",
      deliveryOption: listing.deliveryOption || "delivery",
      isSold: false,
      questions: [],
    };

    setMarketplaceProducts((prev) => {
      const next = [newProduct, ...prev];
      // Keep global PRODUCTS array in sync so that the main catalog can display user listings
      PRODUCTS.unshift(newProduct);
      return next;
    });
  };

  const deleteListing = (id) => {
    setMarketplaceProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from global array
    const idx = PRODUCTS.findIndex((p) => p.id === id);
    if (idx !== -1) PRODUCTS.splice(idx, 1);
  };

  const markAsSold = (id) => {
    setMarketplaceProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSold: true } : p)),
    );
    const matched = PRODUCTS.find((p) => p.id === id);
    if (matched) matched.isSold = true;
  };

  const renewListing = (id) => {
    setMarketplaceProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, isSold: false, estimatedDelivery: "Renewed Today" }
          : p,
      ),
    );
    const matched = PRODUCTS.find((p) => p.id === id);
    if (matched) {
      matched.isSold = false;
      matched.estimatedDelivery = "Renewed Today";
    }
  };

  const startChatSession = (product) => {
    const existing = chats.find(
      (c) => c.productId === product.id && c.sellerName === product.sellerName,
    );
    if (existing) {
      setActiveChatId(existing.id);
      return existing.id;
    }

    const newSessionId = `chat-${Date.now()}`;
    const newSession = {
      id: newSessionId,
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      sellerName: product.sellerName || "NEXUS Seller",
      sellerType: product.sellerType === "business" ? "business" : "individual",
      online: true,
      unread: false,
      messages: [
        {
          id: `msg-${Date.now()}-init`,
          sender: "seller",
          text: `Hi there! I am happy to help you with my listing "${product.name}".`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };

    setChats((prev) => [newSession, ...prev]);
    setActiveChatId(newSessionId);
    return newSessionId;
  };

  const sendChatMessage = (sessionId, text, options = {}) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: options.sender || "buyer",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      ...options,
    };

    setChats((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedMsgs = [...session.messages, newMessage];
          return {
            ...session,
            messages: updatedMsgs,
            unread: options.sender === "seller", // If seller is replying, buyer has unread message
          };
        }
        return session;
      }),
    );

    // Simulate seller typing & replying automatically if buyer sent the message
    if (options.sender !== "seller") {
      simulateSellerReply(sessionId, text);
    }
  };

  const respondToOffer = (sessionId, messageId, status) => {
    setChats((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedMsgs = session.messages.map((m) => {
            if (m.id === messageId) {
              return { ...m, offerStatus: status };
            }
            return m;
          });
          return { ...session, messages: updatedMsgs };
        }
        return session;
      }),
    );

    // Add a text notification message in chat
    setTimeout(() => {
      sendChatMessage(
        sessionId,
        `The offer has been ${status === "accepted" ? "accepted" : "declined"} by the seller.`,
        {
          sender: "seller",
          id: `offer-reply-${Date.now()}`,
        },
      );
    }, 1000);
  };

  const simulateSellerReply = (sessionId, buyerText) => {
    // Show typing indicator
    setChats((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, typing: true } : s)),
    );

    setTimeout(() => {
      let replyText = "That sounds interesting. Let me consider it!";
      const textLower = buyerText.toLowerCase();

      if (textLower.includes("hello") || textLower.includes("hi")) {
        replyText =
          "Hello! Let me know if you would like to ask about the item details.";
      } else if (
        textLower.includes("price") ||
        textLower.includes("discount") ||
        textLower.includes("negotiate")
      ) {
        replyText =
          "I could do a 10% discount if you are ready to pick it up locally.";
      } else if (textLower.includes("shipping") || textLower.includes("ship")) {
        replyText =
          "Yes, I can ship via standard mail. Shipping should take about 3 days.";
      } else if (textLower.includes("offer")) {
        replyText =
          "Please send a official offer price by using our custom Offer panel below!";
      }

      setChats((prev) =>
        prev.map((s) => {
          if (s.id === sessionId) {
            const sellerMessage = {
              id: `msg-${Date.now()}-reply`,
              sender: "seller",
              text: replyText,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
            return {
              ...s,
              messages: [...s.messages, sellerMessage],
              typing: false,
              unread: true,
            };
          }
          return s;
        }),
      );
    }, 2500);
  };

  const submitQuoteRequest = (productId, quantity, companyName, notes) => {
    const targetProd = PRODUCTS.find((p) => p.id === productId);
    if (!targetProd) return;

    const newQuote = {
      id: `q-${Date.now()}`,
      productId,
      productName: targetProd.name,
      quantity,
      pricePerUnit: targetProd.discountPrice,
      totalAmount: targetProd.discountPrice * quantity,
      companyName: companyName || "Independent Corporate",
      notes,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    setQuotes((prev) => [newQuote, ...prev]);
  };

  const respondToQuote = (quoteId, status) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status } : q)),
    );
  };

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const setActiveChatSession = (sessionId) => {
    setActiveChatId(sessionId);
    if (sessionId) {
      setChats((prev) =>
        prev.map((c) => (c.id === sessionId ? { ...c, unread: false } : c)),
      );
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        marketplaceProducts,
        chats,
        quotes,
        businessProfile,
        earnings,
        activeChat,
        userRole,
        setUserRole: handleSetUserRole,
        registerBusiness,
        createListing,
        deleteListing,
        markAsSold,
        renewListing,
        sendChatMessage,
        startChatSession,
        setActiveChatSession,
        submitQuoteRequest,
        respondToQuote,
        updateBusinessSettings,
        respondToOffer,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};

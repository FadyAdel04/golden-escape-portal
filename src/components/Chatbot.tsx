
import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface PredefinedQuestion {
  id: string;
  question: string;
  answer: string;
}

const predefinedQuestions: PredefinedQuestion[] = [
  {
    id: "1",
    question: "What rooms are available this weekend?",
    answer: "We have Deluxe Rooms, Family Suites, and Honeymoon Villas available this weekend. Prices start from $150/night."
  },
  {
    id: "2",
    question: "How much is the Deluxe room?",
    answer: "Our Deluxe Room costs $150 per night and includes free breakfast and access to all hotel amenities."
  },
  {
    id: "3",
    question: "What's your cancellation policy?",
    answer: "You can cancel for free up to 48 hours before your check-in date."
  },
  {
    id: "4",
    question: "Where is your hotel located?",
    answer: "Golden Escape Resort is located in El Gouna, Red Sea, Egypt, near Abu Tig Marina."
  },
  {
    id: "5",
    question: "Do you offer free Wi-Fi?",
    answer: "Yes, we provide free high-speed Wi-Fi throughout the hotel."
  },
  {
    id: "6",
    question: "What facilities do you have?",
    answer: "We offer a spa, swimming pool, gym, beach access, and a gourmet restaurant."
  }
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hello! Welcome to Golden Escape Resort. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [showQuestions, setShowQuestions] = useState(true);

  const handleQuestionClick = (question: PredefinedQuestion) => {
    // Add user question
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: question.question,
      timestamp: new Date()
    };

    // Add bot response
    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: "bot",
      content: question.answer,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setShowQuestions(false);
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        type: "bot",
        content: "Hello! Welcome to Golden Escape Resort. How can I help you today?",
        timestamp: new Date()
      }
    ]);
    setShowQuestions(true);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      resetChat();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Interface */}
      {isOpen && (
        <Card className="w-80 sm:w-96 h-96 mb-4 shadow-2xl border-gold/20 animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-gold to-gold/80 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-playfair">Golden Escape Resort</CardTitle>
                <p className="text-sm opacity-90">Chat Assistant</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-gold text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Predefined Questions */}
            {showQuestions && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-xs text-gray-600 mb-3 font-medium">
                  Choose a question to get started:
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {predefinedQuestions.map((q) => (
                    <Button
                      key={q.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuestionClick(q)}
                      className="w-full text-left justify-start text-xs p-2 h-auto hover:bg-gold/10 hover:border-gold/30"
                    >
                      {q.question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {!showQuestions && (
              <div className="p-4 border-t bg-gray-50">
                <Button
                  onClick={resetChat}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs hover:bg-gold/10 hover:border-gold/30"
                >
                  Ask Another Question
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className={`h-14 w-14 rounded-full shadow-lg bg-gold hover:bg-gold/90 transition-all duration-300 ${
          isOpen ? 'rotate-0' : 'hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
};

export default Chatbot;

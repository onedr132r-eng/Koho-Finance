import { useState } from "react";
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle, Send, X, AlertCircle } from "lucide-react";
import { Link } from "wouter";

const FAQS = [
  { q: "How do I add money to my KOHO account?", a: "You can add money via Interac e-Transfer, direct deposit from your employer, or by linking a bank account. Go to Home > Add money to get started." },
  { q: "Why was my transaction declined?", a: "Transactions may be declined due to insufficient funds, velocity limits, or a frozen card. Check your balance and card status in the app. If the issue persists, contact support." },
  { q: "How do I dispute a transaction?", a: "Navigate to the transaction in your Transactions tab, tap it, then select 'Dispute this transaction'. You have 60 days from the transaction date to file a dispute." },
  { q: "What is KOHO Cover?", a: "Cover is an overdraft protection feature that lets you spend a small amount beyond your balance (up to $50 depending on your plan) without fees. You repay it on your next deposit." },
  { q: "How does cashback work?", a: "You earn cashback on eligible purchases made with your KOHO card. The rate depends on your plan. Cashback is credited to your account at the end of each month." },
  { q: "How do I freeze my card?", a: "Go to the Cards tab and tap 'Freeze'. Your card will be instantly blocked for new purchases but existing recurring payments may still process." },
  { q: "Can I use KOHO internationally?", a: "Yes! Your KOHO Mastercard is accepted worldwide. A foreign transaction fee may apply depending on your plan. Check your plan details for specifics." },
  { q: "How do I change my PIN?", a: "Go to Cards > Change PIN and enter a new 4-digit PIN using the secure keypad in the app." },
  { q: "How do I close my account?", a: "You can request account closure by contacting support. Your remaining balance will be returned to you within 10 business days." },
  { q: "Is my money insured?", a: "Your KOHO balance is held by Peoples Trust Company, which is a member of Canada Deposit Insurance Corporation (CDIC), providing deposit protection up to $100,000." },
];

type ChatMsg = { from: "user" | "koho"; text: string };

const AUTO_REPLIES = [
  "Thanks for reaching out! A KOHO agent will be with you shortly (average wait: 2 min).",
  "I can help with that! Could you provide a few more details?",
  "Got it. Let me look into that for you.",
];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    { from: "koho", text: "👋 Hi! I'm KOHO Support. How can I help you today?" },
  ]);
  const [showDispute, setShowDispute] = useState(false);
  const [disputeText, setDisputeText] = useState("");
  const [disputeSent, setDisputeSent] = useState(false);
  const [replyIdx, setReplyIdx] = useState(0);

  const filteredFaqs = FAQS.filter(
    f => !searchQuery || f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMsg = { from: "user", text: chatInput.trim() };
    setChatInput("");
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => {
      const reply = AUTO_REPLIES[replyIdx % AUTO_REPLIES.length];
      setMessages(prev => [...prev, { from: "koho", text: reply }]);
      setReplyIdx(i => i + 1);
    }, 900);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="flex items-center px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <Link href="/profile" className="p-1 rounded-full hover:bg-gray-100 mr-3">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-base font-bold text-gray-900">Support</h1>
      </header>

      {/* Search */}
      <div className="px-4 pt-5 pb-2">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Help Center"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
          />
        </div>
      </div>

      {/* Quick CTAs */}
      <div className="px-4 py-3 flex gap-3">
        <button
          onClick={() => setShowChat(true)}
          className="flex-1 flex flex-col items-center gap-2 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <MessageCircle className="w-6 h-6 text-purple-700" />
          <span className="text-xs font-bold text-gray-800">Chat with us</span>
          <span className="text-[10px] text-green-500 font-semibold">● Online now</span>
        </button>
        <button
          onClick={() => setShowDispute(true)}
          className="flex-1 flex flex-col items-center gap-2 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <AlertCircle className="w-6 h-6 text-red-500" />
          <span className="text-xs font-bold text-gray-800">Dispute a transaction</span>
          <span className="text-[10px] text-gray-400 font-semibold">60-day window</span>
        </button>
      </div>

      {/* FAQ */}
      <div className="px-4 mt-3">
        <h2 className="text-sm font-black text-gray-700 mb-3 px-1">Frequently Asked Questions</h2>
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-gray-500 text-sm">No results for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left transition-colors"
                >
                  <span className="font-medium text-gray-900 text-sm pr-2 leading-snug">{faq.q}</span>
                  {openFaq === idx
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center">
                <span className="text-white font-black text-sm">K</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">KOHO Support</p>
                <p className="text-[10px] text-green-500 font-semibold">● Online</p>
              </div>
            </div>
            <button onClick={() => setShowChat(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={msg.from === "user"
                    ? { backgroundColor: "#3B1F8C", color: "#fff", borderBottomRightRadius: 4 }
                    : { backgroundColor: "#F3F4F6", color: "#111827", borderBottomLeftRadius: 4 }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendChat()}
              placeholder="Type a message…"
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button
              onClick={sendChat}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ background: "#3B1F8C" }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Dispute modal */}
      {showDispute && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={() => setShowDispute(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-sm p-6 pb-10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-end mb-3">
              <button onClick={() => setShowDispute(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            {!disputeSent ? (
              <>
                <h2 className="text-xl font-black text-gray-900 mb-1">Dispute a transaction</h2>
                <p className="text-sm text-gray-500 mb-4">Describe the transaction you want to dispute and our team will investigate within 5 business days.</p>
                <textarea
                  value={disputeText}
                  onChange={e => setDisputeText(e.target.value)}
                  placeholder="Describe the transaction — merchant name, date, amount, and the reason for the dispute…"
                  rows={4}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 mb-4"
                />
                <button
                  onClick={() => disputeText.trim() && setDisputeSent(true)}
                  disabled={!disputeText.trim()}
                  className="w-full py-4 rounded-full font-bold text-base text-white transition-all disabled:opacity-40"
                  style={{ background: "#3B1F8C" }}
                >
                  Submit dispute
                </button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h2 className="text-xl font-black text-gray-900 text-center mb-2">Dispute submitted</h2>
                <p className="text-sm text-gray-500 text-center mb-6">We'll investigate and contact you within 5 business days at rayanre@hotmail.fr.</p>
                <button onClick={() => { setShowDispute(false); setDisputeSent(false); setDisputeText(""); }} className="w-full py-4 rounded-full font-bold text-base text-white" style={{ background: "#3B1F8C" }}>
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

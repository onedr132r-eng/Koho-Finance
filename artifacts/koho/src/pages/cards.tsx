import { useState } from "react";
import { Lock, Unlock, CreditCard, RefreshCw, Palette, Info, X, Eye, EyeOff, AlertTriangle, Package, Hash } from "lucide-react";
import { Link } from "wouter";

type Modal = "none" | "lost" | "order" | "pin";

export default function Cards() {
  const [flipped, setFlipped] = useState(false);
  const [cvvVisible, setCvvVisible] = useState(false);
  const [frozen, setFrozen] = useState(true);
  const [modal, setModal] = useState<Modal>("none");
  const [pin, setPin] = useState<string[]>([]);
  const [pinStep, setPinStep] = useState<"enter" | "confirm" | "done">("enter");
  const [firstPin, setFirstPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [lostDone, setLostDone] = useState(false);

  const openModal = (m: Modal) => {
    setModal(m);
    if (m === "pin") { setPin([]); setPinStep("enter"); setFirstPin(""); setPinError(false); }
    if (m === "order") setOrderDone(false);
    if (m === "lost") setLostDone(false);
  };
  const closeModal = () => setModal("none");

  const handlePinKey = (d: string) => {
    if (pin.length >= 4) return;
    const next = [...pin, d];
    setPin(next);
    if (next.length === 4) {
      const code = next.join("");
      setTimeout(() => {
        if (pinStep === "enter") {
          setFirstPin(code);
          setPinStep("confirm");
          setPin([]);
          setPinError(false);
        } else {
          if (code === firstPin) {
            setPinStep("done");
          } else {
            setPinError(true);
            setPinStep("enter");
            setFirstPin("");
            setPin([]);
          }
        }
      }, 200);
    }
  };
  const handlePinBack = () => setPin(p => p.slice(0, -1));

  return (
    <div className="h-full overflow-y-auto pb-24" style={{ backgroundColor: "#F5F3FF" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="w-9" />
        <h1 className="text-base font-bold text-gray-900">My cards</h1>
        <Link
          href="/"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-5 h-5 text-gray-700" />
        </Link>
      </div>

      {/* Card flip container */}
      <div className="px-5 mb-3" style={{ perspective: "1200px" }}>
        <div
          className="relative w-full cursor-pointer"
          style={{
            aspectRatio: "1.6/1",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1)",
          }}
          onClick={() => setFlipped(f => !f)}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: frozen
                ? "linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 40%, #3a3a3a 100%)"
                : "linear-gradient(135deg, #1a1040 0%, #221555 40%, #1e1248 100%)",
              filter: frozen ? "saturate(0.15)" : "none",
              transition: "background 0.4s, filter 0.4s",
            }}
          >
            <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-widest" style={{ color: "#8B8BA0" }}>VIRTUAL</p>
                <p className="text-[11px] font-bold tracking-widest" style={{ color: "#8B8BA0" }}>VIRTUELLE</p>
              </div>
              <span className="text-2xl font-black tracking-tight" style={{ color: frozen ? "#aaa" : "#C4E538", letterSpacing: "-0.5px" }}>KOHO</span>
            </div>
            {frozen && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full px-4 py-2 shadow-lg" style={{ backgroundColor: "rgba(255,255,255,0.92)" }}>
                  <Lock className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-semibold text-gray-800">Frozen</span>
                </div>
              </div>
            )}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <span className="text-white font-mono text-base font-semibold tracking-widest">**** 4126</span>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: "#EB001B", opacity: 0.92 }} />
                <div className="w-8 h-8 rounded-full -ml-3" style={{ backgroundColor: "#F79E1B", opacity: 0.92 }} />
              </div>
            </div>
            <div className="absolute bottom-1 inset-x-0 flex justify-center">
              <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.25)" }}>Tap to see details</span>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(135deg, #1e1248 0%, #221555 60%, #1a1040 100%)",
            }}
          >
            <div className="absolute top-8 inset-x-0 h-10" style={{ backgroundColor: "rgba(0,0,0,0.55)" }} />
            <div className="absolute top-24 left-5 right-5">
              <p className="text-[10px] font-bold tracking-widest mb-1" style={{ color: "#8B8BA0" }}>CVV</p>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 w-24">
                <span className="text-white font-mono font-bold text-base tracking-widest flex-1">•••</span>
                <button onClick={e => { e.stopPropagation(); setCvvVisible(v => !v); }} className="text-white/70 hover:text-white transition-colors">
                  {cvvVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="absolute bottom-14 left-5 right-5">
              <p className="text-[10px] font-bold tracking-widest mb-1" style={{ color: "#8B8BA0" }}>CARD NUMBER</p>
              <p className="text-white font-mono font-bold text-base tracking-[0.15em]">5168 •••• •••• 4126</p>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest mb-0.5" style={{ color: "#8B8BA0" }}>EXPIRES</p>
                <p className="text-white font-mono font-bold">09 / 28</p>
              </div>
              <span className="text-xl font-black tracking-tight" style={{ color: "#C4E538" }}>KOHO</span>
            </div>
            <div className="absolute bottom-1 inset-x-0 flex justify-center">
              <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.25)" }}>Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#C5B8F0" }} />
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#5B3FCC" }} />
      </div>

      <div className="px-5 mb-5">
        <h2 className="text-xl font-bold text-gray-900">Virtual card ···· 4126</h2>
      </div>

      {/* CTAs */}
      <div className="px-5 flex gap-3 mb-6">
        <button
          onClick={() => setFrozen(f => !f)}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-[15px] transition-all active:scale-95"
          style={{ backgroundColor: frozen ? "#3D2A8A" : "#16A34A" }}
        >
          {frozen ? <><Lock className="w-5 h-5" /> Unfreeze</> : <><Unlock className="w-5 h-5" /> Freeze</>}
        </button>
        <button
          onClick={() => setFlipped(f => !f)}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-[15px] transition-all active:scale-95"
          style={{ backgroundColor: "#E8E3FF", color: "#3D2A8A" }}
        >
          <CreditCard className="w-5 h-5" />
          {flipped ? "Hide details" : "See details"}
        </button>
      </div>

      {/* Action rows */}
      <div className="px-5 space-y-3">
        <div className="bg-white rounded-3xl overflow-hidden divide-y divide-gray-100 shadow-sm">
          <button onClick={() => openModal("lost")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-gray-900 text-[15px]">Report lost / stolen</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={() => openModal("order")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <Package className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900 text-[15px]">Order physical card</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={() => openModal("pin")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <Hash className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900 text-[15px]">Change PIN</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={() => openModal("order")} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <RefreshCw className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900 text-[15px]">Replace card</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          <Link href="/card-library" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <Palette className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900 text-[15px]">Change card design</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
          <Link href="/feature/virtual-card-info" className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <Info className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900 text-[15px]">Learn more about virtual card</span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>

      {/* MODALS */}
      {modal !== "none" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={closeModal}>
          <div className="bg-white rounded-t-3xl w-full max-w-sm p-6 pb-10" onClick={e => e.stopPropagation()}>

            {/* Lost/Stolen */}
            {modal === "lost" && !lostDone && (
              <>
                <div className="flex justify-end mb-2">
                  <button onClick={closeModal}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h2 className="text-xl font-black text-gray-900 text-center mb-2">Report lost / stolen?</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Your current virtual card ending in <b>4126</b> will be permanently blocked and a new card will be issued.</p>
                <button
                  onClick={() => setLostDone(true)}
                  className="w-full py-4 rounded-full font-bold text-base text-white bg-red-500 hover:bg-red-600 transition-colors mb-3"
                >
                  Yes, report & block card
                </button>
                <button onClick={closeModal} className="w-full py-3 rounded-full font-bold text-base text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </>
            )}
            {modal === "lost" && lostDone && (
              <>
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h2 className="text-xl font-black text-gray-900 text-center mb-2">Card reported</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Your card has been blocked. A new virtual card will be ready in your account shortly.</p>
                <button onClick={closeModal} className="w-full py-4 rounded-full font-bold text-base text-white" style={{ background: "#3B1F8C" }}>
                  Done
                </button>
              </>
            )}

            {/* Order Physical Card */}
            {modal === "order" && !orderDone && (
              <>
                <div className="flex justify-end mb-2">
                  <button onClick={closeModal}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-7 h-7 text-purple-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900 text-center mb-2">Order physical card</h2>
                <p className="text-sm text-gray-500 text-center mb-4">We'll mail a physical Mastercard to your address on file. It arrives in 5–10 business days.</p>
                <div className="bg-gray-50 rounded-2xl px-4 py-3 mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Shipping to</p>
                  <p className="text-sm font-semibold text-gray-800">209-385 Rue Lockwell</p>
                  <p className="text-sm text-gray-600">Quebec, QC  G1R 5J6</p>
                </div>
                <button
                  onClick={() => setOrderDone(true)}
                  className="w-full py-4 rounded-full font-bold text-base text-white mb-3"
                  style={{ background: "#3B1F8C" }}
                >
                  Order now — free
                </button>
                <button onClick={closeModal} className="w-full py-3 rounded-full font-bold text-base text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </>
            )}
            {modal === "order" && orderDone && (
              <>
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📬</span>
                </div>
                <h2 className="text-xl font-black text-gray-900 text-center mb-2">Card on its way!</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Your physical card has been ordered. Expect it in 5–10 business days.</p>
                <button onClick={closeModal} className="w-full py-4 rounded-full font-bold text-base text-white" style={{ background: "#3B1F8C" }}>
                  Done
                </button>
              </>
            )}

            {/* Change PIN */}
            {modal === "pin" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div />
                  <h2 className="text-base font-black text-gray-900">
                    {pinStep === "done" ? "PIN changed!" : pinStep === "confirm" ? "Confirm new PIN" : "Enter new PIN"}
                  </h2>
                  <button onClick={closeModal}><X className="w-5 h-5 text-gray-400" /></button>
                </div>

                {pinStep === "done" ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <p className="text-sm text-gray-500 text-center mb-6">Your card PIN has been updated successfully.</p>
                    <button onClick={closeModal} className="w-full py-4 rounded-full font-bold text-base text-white" style={{ background: "#3B1F8C" }}>
                      Done
                    </button>
                  </>
                ) : (
                  <>
                    {pinError && (
                      <p className="text-xs text-red-500 text-center mb-2 font-semibold">PINs don't match. Try again.</p>
                    )}
                    <div className="flex justify-center gap-4 mb-8">
                      {[0, 1, 2, 3].map(i => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border-2 transition-all"
                          style={{
                            backgroundColor: i < pin.length ? "#3B1F8C" : "transparent",
                            borderColor: i < pin.length ? "#3B1F8C" : "#D1D5DB",
                          }}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
                        <button
                          key={i}
                          onClick={() => k === "⌫" ? handlePinBack() : k !== "" ? handlePinKey(k) : undefined}
                          className={`py-4 rounded-2xl text-xl font-bold transition-all active:scale-95 ${k === "" ? "invisible" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

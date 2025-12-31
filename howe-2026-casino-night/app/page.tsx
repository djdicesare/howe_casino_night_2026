'use client';
import { useState, useMemo, useEffect } from 'react';
import { 
  Trophy, 
  PlusCircle, 
  Coins, 
  ShieldCheck, 
  RefreshCw, 
  X, 
  Crown, 
  Medal,
  Trash2
} from 'lucide-react';
import { fetchGameLeaders, fetchChipLeader, fetchGames, fetchAuditTrail, fetchPlayers, fetchAdminGameResults, Player, GameLeader, Game, AuditTrail} from '@/lib/supabase/casino-service';


export default function App() {
  const [view, setView] = useState('leaderboard'); // 'leaderboard' | 'games' | 'admin'
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chipLeaders, setChipLeaders] = useState<Player[]>([]);
  const [gameLeaders, setGameLeaders] = useState<GameLeader[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers ] = useState<Player[]>([]);

  //Admin form
  const [adminForm, setAdminForm] = useState({
    playerId: '',
    gameId: '',
    chipsChange: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
        const chipLeaders = await fetchChipLeader();
        const gameLeaders = await fetchGameLeaders();
        const games = await fetchGames();
        const users = await fetchPlayers();
        setChipLeaders(chipLeaders);
        setGameLeaders(gameLeaders);
        setGames(games);
        setUsers(users);
        console.log(chipLeaders, gameLeaders, games, users);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const groupedGameLeaders = useMemo(() => {
    return gameLeaders.reduce((acc: { [key: string]: GameLeader[] }, curr)  => {
      if (!acc[curr.game_name]) acc[curr.game_name] = [];
      acc[curr.game_name].push(curr);
      return acc;
    }, {});
  }, [gameLeaders]);

  const handleAdminLogin = () => {
    const pin = prompt("Enter Admin PIN:");
    if (pin === "2025") {
      setIsAdmin(true);
      setView('admin');
    } else {
      alert("Unauthorized access attempt recorded.");
    }
  };

  const simulateRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] font-sans selection:bg-[#D4AF37] selection:text-black antialiased overscroll-none">
      {/* Status Bar / Header */}
      {/* CSS Injection to handle the browser's root background 
          This prevents the "white" from showing during hard scrolls.
      */}
      <style jsx global>{`
        html, body {
          background-color: #050505 !important;
          overscroll-behavior-y: none; /* Prevents the bounce effect entirely */
          margin: 0;
          padding: 0;
        }
      `}</style>
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-0.5">Howe Casino Night</h1>
          <p className="text-xl font-semibold tracking-tight leading-none">NYE 2026</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={simulateRefresh}
            className={`p-2 rounded-full hover:bg-white/5 transition-all active:scale-90 ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} className="text-white/60" />
          </button>
          {!isAdmin ? (
            <button onClick={handleAdminLogin} className="p-2 rounded-full hover:bg-white/5 text-white/20 transition-colors">
              <ShieldCheck size={20} />
            </button>
          ) : (
             <button onClick={() => setView('admin')} className={`p-2 transition-all ${view === 'admin' ? 'text-[#D4AF37]' : 'text-white/40'}`}>
               <PlusCircle size={24} />
             </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-xl mx-auto px-6 pt-10 pb-32">
        {view === 'leaderboard' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
            <section>
              <div className="flex items-end justify-between mb-8 px-1">
                <div>
                  <h2 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Live Standings</h2>
                  <p className="text-3xl font-bold tracking-tight">Top Rollers</p>
                </div>
                <Trophy className="text-[#D4AF37] mb-1" size={28} />
              </div>

              <div className="space-y-3">
                {chipLeaders.map((player, idx) => {
                  const isLast = idx === chipLeaders.length - 1;

                  // Color and Glow logic
                  const isGold = idx === 0;
                  const isSilver = idx === 1;
                  const isBronze = idx === 2;

                  let containerStyles = "bg-[#111] border-white/5 hover:border-white/10";
                  if (isGold) containerStyles = "bg-gradient-to-br from-[#1a1608] to-[#0a0a0a] border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]";
                  if (isSilver) containerStyles = "bg-gradient-to-br from-[#141414] to-[#0a0a0a] border-[#C0C0C0]/20 shadow-[0_0_25px_rgba(192,192,192,0.07)]";
                  if (isBronze) containerStyles = "bg-gradient-to-br from-[#120e0a] to-[#0a0a0a] border-[#CD7F32]/20 shadow-[0_0_25px_rgba(205,127,50,0.07)]";

                  return (
                    <div 
                      key={idx} 
                      className={`group relative flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 ${containerStyles}`}
                    >
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <span className={`w-10 h-10 flex items-center justify-center rounded-2xl text-sm font-bold transition-transform group-hover:scale-105 ${
                            isGold ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 
                            isSilver ? 'bg-[#C0C0C0] text-black shadow-lg shadow-[#C0C0C0]/10' : 
                            isBronze ? 'bg-[#CD7F32] text-black shadow-lg shadow-[#CD7F32]/10' : 'bg-white/5 text-white/40'
                          }`}>
                            {idx + 1}
                          </span>
                          {isGold && <Crown size={14} className="absolute -top-2 -right-2 text-[#D4AF37] drop-shadow-md animate-pulse" />}
                          {isLast && <Trash2 size={16} className="absolute -top-2 -right-2 text-red-500/60 drop-shadow-md animate-pulse" />}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-lg tracking-tight ${isGold ? 'text-white' : 'text-white/90'}`}>
                              {player.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono text-xl font-bold tracking-tighter ${
                          isGold ? 'text-[#D4AF37]' : 
                          isSilver ? 'text-[#C0C0C0]' : 
                          isBronze ? 'text-[#CD7F32]' : 'text-white/80'
                        }`}>
                          {player.total_chips.toLocaleString()}
                        </span>
                        <p className="text-[9px] text-white/20 uppercase font-black tracking-[0.1em] mt-0.5">Chips</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {view === 'games' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
             <div>
                <h2 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] mb-1 px-1">Game Royalty</h2>
                <p className="text-3xl font-bold tracking-tight px-1 mb-8">Table Leaders</p>
             </div>
             
             {Object.entries(groupedGameLeaders).map(([gameName, players]) => (
               <section key={gameName} className="relative">
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <div className="h-4 w-1 bg-[#D4AF37] rounded-full" />
                    <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest">{gameName}</h2>
                  </div>
                  <div className="bg-[#111] rounded-[2.5rem] border border-white/5 divide-y divide-white/5 shadow-xl">
                    {players.map((p, i) => (
                      <div key={i} className="flex justify-between p-6 items-center hover:bg-white/[0.02] transition-colors first:rounded-t-[2.5rem] last:rounded-b-[2.5rem]">
                        <div className="flex items-center gap-4">
                          <span className="text-white/90 font-medium">{p.player_name}</span>
                          {i === 0 && <Medal size={16} className="text-[#D4AF37]/60" />}
                        </div>
                        <span className="font-mono font-bold text-white/40 bg-white/5 px-3 py-1 rounded-full text-sm">
                          {p.game_chips.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
               </section>
             ))}
          </div>
        )}

        {view === 'admin' && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <header className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Vault Entry</h2>
              <button onClick={() => setView('leaderboard')} className="p-2 bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                <X size={24}/>
              </button>
            </header>
            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
               <p className="text-white/40 text-center italic text-sm">Database connection is offline for dummy mode.</p>
               <button 
                  disabled 
                  className="w-full bg-white/5 border border-white/10 text-white/20 py-5 rounded-2xl font-bold text-lg"
               >
                 Insert Transaction
               </button>
            </div>
          </div>
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[85%] max-w-sm z-50">
        <div className="bg-[#161617]/90 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex justify-between shadow-2xl ring-1 ring-white/5">
          <button 
            onClick={() => setView('leaderboard')}
            className={`flex-1 flex flex-col items-center py-3 rounded-full transition-all duration-500 ${view === 'leaderboard' ? 'bg-white text-black scale-100' : 'text-white/30 hover:text-white/60'}`}
          >
            <Trophy size={20} />
            <span className="text-[9px] mt-1.5 font-bold uppercase tracking-widest">Rankings</span>
          </button>
          <button 
            onClick={() => setView('games')}
            className={`flex-1 flex flex-col items-center py-3 rounded-full transition-all duration-500 ${view === 'games' ? 'bg-white text-black scale-100' : 'text-white/30 hover:text-white/60'}`}
          >
            <Coins size={20} />
            <span className="text-[9px] mt-1.5 font-bold uppercase tracking-widest">Tables</span>
          </button>
        </div>
      </nav>
      
      {/* Decorative Blur */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none -z-10" />
    </div>
  );
}
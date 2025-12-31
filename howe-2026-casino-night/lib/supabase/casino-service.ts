
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabaseClient: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export interface Player {
    user_id?: number;
    name: string;
    total_chips: number;
    is_admin?: boolean;
}

export interface GameLeader {
    game_name: string;
    player_name: string;
    game_chips: number;
}

export interface Game {
    game_id: number;
    name: string;
    description: string;
}

export interface GameResult {
    game_name: string;
    game_id: number;
    player_id: string;
    player_name: string;
    chip_gain: number;
    timestamp: string;
}

export interface AuditTrail {
    id: number;
    action: string;
    admin_name: string;
    timestamp: string;
}

export interface AdminGameResult {
    result_id: string;
    player_id: string;
    player_name: string;
    game_id: string;
    game_name: string;
    chip_gain: number;
    created_at: string;
}


export async function fetchChipLeader(): Promise<Player[]> {
    const { data, error } = await supabaseClient
        .from('global_leaderboard')
        .select('name, total_chips')
        .order('total_chips', { ascending: false });

    if (error) {
        console.error('Error fetching chip leader:', error);
        throw error;
    }
    console.log('Fetched chip leader:', data);
    return (data || []) as Player[];
}

export async function fetchGameLeaders(): Promise<GameLeader[]> {
    const { data, error } = await supabaseClient
      .from('game_leaders')
      .select('game_name, player_name, game_chips')
      .order('game_chips', { ascending: false });

    if (error) {
      console.error('Error fetching game leaders:', error);
      throw error;
    }
    console.log('Fetched game leaders:', data);
    return (data || []) as GameLeader[];
}

export async function fetchGames(): Promise<Game[]> {
    const { data, error } = await supabaseClient
      .from('games')
      .select('game_id, name, description');
      
    if (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
    console.log('Fetched games:', data);
    return (data || []) as Game[];
}

export async function fetchAuditTrail(): Promise<AuditTrail[]> {
    const { data, error } = await supabaseClient
      .from('audit_trail')
      .select('id, action, admin_name, timestamp')
      .order('timestamp', { ascending: false });
      
    if (error) {
        console.error('Error fetching audit trail:', error);
        throw error;
    }
    console.log('Fetched audit trail:', data);
    return (data || []) as AuditTrail[];
}

export async function fetchPlayers(): Promise<Player[]> {
    const { data, error } = await supabaseClient
      .from('users')
      .select('user_id, name, is_admin')
      .order('name', { ascending: true });
      
    if (error) {
        console.error('Error fetching players:', error);
        throw error;
    }
    console.log('Fetched players:', data);
    return (data || []) as Player[];
}

export async function fetchGameResults(gameId: number): Promise<GameResult[]> {
    const { data, error } = await supabaseClient
      .from('game_results')
      .select('game_id, player_name, chip_gain, timestamp')
      .eq('game_id', gameId)
      .order('timestamp', { ascending: false });
      
    if (error) {
        console.error('Error fetching game results:', error);
        throw error;
    }
    console.log('Fetched game results:', data);
    return (data || []) as GameResult[];
}

export async function fetchAdminGameResults(): Promise<AdminGameResult[]>{
    const { data, error } = await supabaseClient
        .from('game_results_detailed')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching detailed game results:', error);
        throw error;
    }

    return (data || []) as AdminGameResult[];
}

export async function deleteGameResult(resultId: string): Promise<void> {
    console.log('Deleting game result with ID:', resultId);
    const { error } = await supabaseClient
        .from('game_results')
        .delete()
        .eq('result_id', resultId);

    if (error) {
        console.error('Error deleting game result:', error);
        throw error;
    }
}

export async function addPlayerGameResult(playerId: string, gameId: number, chipsChange: number): Promise<void> {
    const { error } = await supabaseClient
        .from('game_results')
        .insert([
            {
                player_id: playerId,
                game_id: gameId,
                chip_gain: chipsChange,
            },
        ]);

    if (error) {
        console.error('Error adding player game result:', error);
        throw error;
    }

    console.log('Added player game result successfully', { playerId, gameId, chipsChange });
}
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra

const supabaseUrl = extra?.supabaseUrl
const supabaseAnonKey = extra?.supabaseAnonKey

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key are missing.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

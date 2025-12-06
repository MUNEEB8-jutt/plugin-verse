export interface User {
  id: string
  balance: number
  created_at: string
}

export type DownloadType = 'upload' | 'external'
export type Platform = 'plugin' | 'mod-fabric' | 'mod-forge'

export interface Plugin {
  id: string
  title: string
  description: string
  price_coins: number
  logo_url: string
  file_url: string | null
  download_type: DownloadType
  external_url: string | null
  version: string
  platform: Platform
  created_at: string
}

export interface Purchase {
  id: string
  user_id: string
  plugin_id: string
  purchased_at: string
  plugin?: Plugin
}

export type DepositMethod = 'Easypaisa' | 'JazzCash' | 'UPI'
export type DepositStatus = 'pending' | 'approved' | 'rejected'

export interface Deposit {
  id: string
  user_id: string
  amount: number
  method: DepositMethod
  transaction_id: string
  screenshot_url: string
  status: DepositStatus
  created_at: string
}

export interface Settings {
  key: string
  value: string
  updated_at?: string
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

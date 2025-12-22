// ======================================================
// 🔧 Fix Console Statements Script
// ======================================================
// This script helps identify files that need console statement fixes

import { readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'

const srcDir = './src/app'
const consolePattern = /console\.(log|error|warn|info|debug)\(/g

function scanDirectory(dir: string): void {
  const files = readdirSync(dir)
  
  files.forEach(file => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)
    
    if (stat.isDirectory()) {
      scanDirectory(filePath)
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = readFileSync(filePath, 'utf-8')
      const matches = content.match(consolePattern)
      
      if (matches && matches.length > 0) {
        console.log(`📄 ${filePath}`)
        console.log(`   Found ${matches.length} console statement(s)`)
        console.log('')
      }
    }
  })
}

console.log('🔍 Scanning for console statements in client components...\n')
scanDirectory(srcDir)
console.log('✅ Scan complete!')
console.log('\n💡 Replace console statements with logger from @/lib/logger')

import React from 'react'
import {auth} from '../firebase'

export const Feed = () => {
  return (
    <div>
      Feed

      {/* auth.signOutはfirebaseの機能. onAuthStateChangedで更新を検知してdispatchでstateを変更する */}
      <button onClick={() => auth.signOut()}>
        Logout
      </button>
    </div>
  )
}

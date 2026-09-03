/*
 * App.tsx
 *
 * Created on 2026-09-03
 *
 * Copyright (C) 2026 Volkswagen AG, All rights reserved.
 */

import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {HomePage} from './HomePage'
import {ProfilePage} from './ProfilePage'
import {YearPage} from './YearPage'
import {LocaleProvider} from './i18n/LocaleContext'
import type {Profile} from './types'
import raw from './data/profiles.json' with {type: 'json'}

const profiles = raw as Profile[]

export default function App() {
  return (<LocaleProvider>
              <BrowserRouter basename={import.meta.env.BASE_URL}>
                  <Routes>
                      <Route path="/" element={<HomePage profiles={profiles}/>}/>
                      <Route path="/year" element={<YearPage profiles={profiles}/>}/>
                      <Route path="/p/:githubId" element={<ProfilePage profiles={profiles}/>}/>
                  </Routes>
              </BrowserRouter>
          </LocaleProvider>
  )
}

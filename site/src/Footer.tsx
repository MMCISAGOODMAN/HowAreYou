import { Link } from 'react-router-dom'
import { CONTRIBUTING_URL, CURRENT_YEAR, REPO_URL } from './constants'

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-main">普通开发者的真实状态，正在变成一本开源编年史。</p>
      <p className="footer-links">
        <a href={REPO_URL}>在 GitHub 上参与</a>
        <span aria-hidden="true"> · </span>
        <a href={CONTRIBUTING_URL}>阅读参与指南</a>
        <span aria-hidden="true"> · </span>
        <Link to="/year">{CURRENT_YEAR} 编年史</Link>
        <span aria-hidden="true"> · </span>
        <Link to="/">How Are You</Link>
      </p>
      <p className="footer-note">路过的人会读到。你并不孤单。</p>
    </footer>
  )
}

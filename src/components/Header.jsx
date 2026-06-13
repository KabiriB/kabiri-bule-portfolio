function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Kabiri Bule home">
        <span className="brand-mark">KB</span>
        <span className="brand-text">Kabiri Bule</span>
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        <a href="#studios">Studios</a>
        <a href="#writing">Writing</a>
        <a href="#research">Research</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

export default Header;

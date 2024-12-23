import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [pages, setPages] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Stato per controllare l'apertura del menu
  const [openSubMenus, setOpenSubMenus] = useState({}); // Stato per gestire l'apertura dei singoli sottomenù
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024); // Stato per rilevare se è in modalità desktop

  useEffect(() => {
    const fetchData = async () => {
      const url = `${process.env.REACT_APP_BACKEND_HOST}/api/pages`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_FETCH_TOKEN}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    };

    fetchData();

    // Funzione per gestire il resize della finestra
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize); // Ascolta i cambiamenti della larghezza della finestra
    return () => window.removeEventListener("resize", handleResize); // Rimuove l'evento quando il componente viene smontato
  }, []);

  const handleLinkClick = (index, event) => {
    if (!pages[index].sub || pages[index].sub.length === 0) {
      window.location.href = `/${pages[index].url}`; // Naviga alla pagina
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu
  };

  const renderSubItemSection = (sub) => {
    return (
      <ul className="sub-list">
        {sub.map((page, i) => (
          <li key={i}>
            <a href={`/${page.url}`}>{page.name}</a>
          </li>
        ))}
      </ul>
    );
  };

  const renderItem = (page, index, isSubItem = false) => {
    return (
      <div
        className={`navbar-item ${page.sub && page.sub.length > 0 ? "has-sub" : ""} ${openSubMenus[index] ? "open" : ""}`}
        key={index}
        onMouseEnter={() => {
          if (isDesktop && page.sub && page.sub.length > 0) {
            setOpenSubMenus((prevState) => ({
              ...prevState,
              [index]: true,
            }));
          }
        }}
        onMouseLeave={() => {
          if (isDesktop) {
            setOpenSubMenus((prevState) => ({
              ...prevState,
              [index]: false,
            }));
          }
        }}
      >
        <div>
          <a
            href={`/${page.url}`}
            onClick={(event) => {
              if (!isSubItem) handleLinkClick(index, event);
            }}
          >
            {page.name}
          </a>
          {page.sub && page.sub.length > 0 && (
            <span
              className="menu-toggle"
              onClick={(event) => {
                setOpenSubMenus((prevState) => ({
                  ...prevState,
                  [index]: !prevState[index],
                }));
              }}
            >
              {openSubMenus[index] ? " ▲" : " ▼"}
            </span>
          )}
        </div>
        {page.sub && page.sub.length > 0 && openSubMenus[index] && (
          <div className="sub-menu">
            {renderSubItemSection(page.sub)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="navbar pt-3 pb-0 justify-content-center">
      <div className="col-12 col-lg-8">
        <button className="mobile-menu-toggle" onClick={handleMenuToggle}>&#9776; {/* Icona hamburger */}</button>
        <div className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
          {pages.map((page, i) => renderItem(page, i))}
        </div>
      </div>
    </div>
  );
}

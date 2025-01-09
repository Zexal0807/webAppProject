import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [pages, setPages] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Stato per controllare l'apertura del menu
  const [openSubMenus, setOpenSubMenus] = useState({}); // Stato per gestire l'apertura dei singoli sottomenù
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024); // Stato per rilevare se è in modalità desktop
  const [selectedPage, setSelectedPage] = useState(null);

  const navigate = useNavigate(); // Hook di React Router per la navigazione

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

        // Controlla l'URL attuale e imposta la pagina selezionata
        const currentPath = window.location.pathname; // Ottieni il percorso attuale
        const selectedIndex = data.findIndex((page) => `/${page.url}` === currentPath);
        setSelectedPage(selectedIndex); // Imposta la pagina selezionata
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

  const handleLinkClick = (index, event, parentIndex = null) => {
    event.preventDefault(); // Previene la navigazione diretta
  
    const targetIndex = parentIndex !== null ? parentIndex : index; // Usa l'indice della voce principale se è una sottovoce
    setSelectedPage(targetIndex); // Imposta la pagina principale come selezionata
  
    const targetUrl = parentIndex !== null ? pages[parentIndex].sub[index].url : pages[index].url; // Determina l'URL corretto
    navigate(`/${targetUrl}`); // Naviga all'URL corretto
  };
  

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu
  };

  const renderSubItemSection = (sub, parentIndex) => {
    return (
      <ul className="sub-list">
        {sub.map((page, i) => (
          <li key={i}>
            <Link
              to={`/${page.url}`}
              onClick={(event) => handleLinkClick(i, event, parentIndex)} // Passa l'indice della sottovoce e della voce principale
            >
              {page.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  };
  

  const renderItem = (page, index, isSubItem = false) => {
    const isSelected = selectedPage === index; // Verifica se è selezionato
    return (
      <div
      className={`navbar-item ${page.sub && page.sub.length > 0 ? "has-sub" : ""} ${openSubMenus[index] ? "open" : ""} ${isSelected ? "selected" : ""}`}        
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
          <Link
            to={`/${page.url}`}
            onClick={(event) => {
              if (!isSubItem) handleLinkClick(index, event);
            }}
          >
            {page.name}
          </Link>
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
            {renderSubItemSection(page.sub, index)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="navbar pt-3 pb-0 justify-content-center">
      <div className="col-12 col-lg-8">
        <button aria-label="Apri menu di navigazione" className="mobile-menu-toggle" onClick={handleMenuToggle}>&#9776; {/* Icona hamburger */}</button>
        <div className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
          {pages.map((page, i) => renderItem(page, i))}
        </div>
      </div>
    </div>
  );
}

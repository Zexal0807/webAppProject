import './Navbar.css'

export default function Navbar() {

    let pages = [{
        name: "Home",
        url:"/"
    },
    {
        name: "Chi siamo",
        url:"/chi-siamo"
    },{
        name: "Le infezioni",
        url:"/le-infezioni",
        sub:[{
                name: "Chlamydia",
                url:"/chlamydia"
            },{
                name: "Gonorrea",
                url:"/gonorrea"
            },{
                name: "Mycoplasmi ed Ureaplasm",
                url:"/mycoplasmi"
            },{
                name: "HIV",
                url:"/hiv"
            },{
                name: "Sifilide",
                url:"/sifilide"
            },{
                name: "Epatite C",
                url:"/epatite-c"
            },{
                name: "Epatite B",
                url:"/epatite-b"
            },{
                name: "Epatite A",
                url:"/epatite-a"
            },{
                name: "Herpes Genitale",
                url:"/herpes-genitale"
            },{
                name: "Vaginosi Batterica",
                url:"/vaginosi-batterica"
            },{
                name: "Vaiolo delle scimmie(mpox)",
                url:"/vaiolo-delle-scimmie-monkeypox"
            },{
                name: "Glossario",
                url:"/glossario"
            }]
    },{
        name: "Servizi",
        url:"/servizi"
    },{
        name: "Contatti",
        url:"/contatti"
    },{
        name: "Collabora",
        url:"/collabora"
    },{
        name: "Eventi",
        url:"/eventi"
    },{
        name: "Link utili",
        url:"/links-utili"
    }];

    const renderSubItemSection = (sub) => {
        return (
            <div className='sub'>
                {sub.map((page, i) => renderItem(page, i))}
            </div>
        )
    }
    const renderItem = (page, index) => {
        return ( 
            <div className='navbar-item px-2 py-1' key={index}>
                <a href={page.url}>
                    {page.name}
                </a>
                {page.sub && page.sub.length > 0 ? renderSubItemSection(page.sub): ''}
            </div>
        );
    }

    return (
        <div className="navbar pt-3 pb-0 d-flex justify-content-center">
            <div className="col-11 col-sm-8 d-flex flex-column justify-content-center">
                <div className="col-12 d-flex justify-content-between flex-wrap flex-sm-nowrap">
                    {pages.map((page, i) => renderItem(page, i))}
                </div> 
            </div>
        </div>
    );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const INTRO_TIMING = {
  characterEnter: 4800,
  cssStart: 6000,
  centerReached: 9000,
  centerPauseEnd: 11000,
  cssComplete: 14000,
  characterExit: 17100,
  identityInterval: 1400,
} as const;

const IDENTITIES = [
  "Alan Turing",
  "Jiraya",
  "Emynado",
  "Finalement...",
  "Celui que tu pense que je suis",
] as const;

const RAIN_GLYPHS = "01 A B C 7 K 3 9 X J 4 M 2 F Q 8 R N 5".split(" ");

type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  tags?: string[];
  modalMessage: string;
};

const PROJECTS: Project[] = [
  {
    id: "oryon",
    number: "01",
    title: "Oryon",
    category: "Migration, pensée légère",
    description: "Un compagnon pour garder les grands départs un peu moins lourds.",
    tags: ["Next.js", "Prisma"],
    modalMessage: "Site trop moche pour être vu.",
  },
  {
    id: "anansi",
    number: "02",
    title: "ANANSI",
    category: "Bibliothèque sonore privée",
    description: "Des histoires à emporter, sans bruit autour.",
    tags: ["Audio", "Cloud"],
    modalMessage: "Site trop moche pour être vu.",
  },
  {
    id: "chronique",
    number: "03",
    title: "Chronique",
    category: "Univers de jeu partagé",
    description: "Un coin pour inventer des mondes et ne jamais vraiment les quitter.",
    tags: ["React", "JDR"],
    modalMessage: "Site trop moche pour être vu.",
  },
  {
    id: "archives",
    number: "04",
    title: "Voir plus de projets",
    category: "Archives plus ou moins terminées",
    description: "Quelques autres idées que mon cerveau a refusé de laisser tranquilles.",
    modalMessage: "Crois-moi, j’ai beaucoup de projets... Jamais finis.",
  },
];

type ProjectModalProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

function ProjectModal({ isOpen, message, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <section
        className="projectModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modalClose" type="button" onClick={onClose} aria-label="Fermer la fenêtre">
          ×
        </button>
        <div className="joachimIcon joachimIcon--pose">
          <img
            src="/IconePose.png"
            alt="Joachim"
            className="joachimIconImage"
          />
        </div>
        <div>
          <p className="modalEyebrow">Message de Joachim</p>
          <h2 id="project-modal-title">{message}</h2>
          <button className="modalAction" type="button" onClick={onClose}>
            C’est noté
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isStyled, setIsStyled] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [identityIndex, setIdentityIndex] = useState(-1);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isHonestAbout, setIsHonestAbout] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearIntroTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    const schedule = (callback: () => void, delay: number) => {
      const timer = setTimeout(callback, delay);
      timersRef.current.push(timer);
    };

    schedule(() => setShowCharacter(true), INTRO_TIMING.characterEnter);
    schedule(() => setIsInstalling(true), INTRO_TIMING.cssStart);
    schedule(() => {
      setIsInstalling(false);
      setIsStyled(true);
      setIdentityIndex(0);
    }, INTRO_TIMING.cssComplete);
    schedule(() => setShowCharacter(false), INTRO_TIMING.characterExit);

    IDENTITIES.slice(1).forEach((_, index) => {
      schedule(
        () => setIdentityIndex(index + 1),
        INTRO_TIMING.cssComplete + INTRO_TIMING.identityInterval * (index + 1),
      );
    });

    return clearIntroTimers;
  }, [clearIntroTimers]);

  const skipIntro = () => {
    clearIntroTimers();
    setIsInstalling(false);
    setIsStyled(true);
    setShowCharacter(false);
    setIdentityIndex(IDENTITIES.length - 1);
  };

  const closeModal = useCallback(() => setSelectedProject(null), []);

  return (
    <main className={`portfolio ${isInstalling ? "portfolio--installing" : ""} ${isStyled ? "portfolio--ready" : ""}`}>
      {!isStyled && (
        <button className="skipIntro" type="button" onClick={skipIntro}>
          Passer l’introduction
        </button>
      )}

      {showCharacter && (
        <div className="characterRunner" aria-label="Joachim installe le design">
          <img className="characterImage characterImage--walk" src="/IconeMarche.png" alt="Joachim marche avec ses outils" />
          <img className="characterImage characterImage--repair" src="/IconeRepare.png" alt="Joachim répare le site" />
        </div>
      )}

      <section className="rawPage" aria-label="Page en cours de mise en forme">
        <p>&lt;!DOCTYPE html&gt;</p>
        <p>&lt;html lang="fr"&gt;</p>
        <p>&nbsp; &lt;head&gt;</p>
        <p>&nbsp; &nbsp; &lt;title&gt;Joachim Cishugi&lt;/title&gt;</p>
        <p>&nbsp; &lt;/head&gt;</p>
        <p>&nbsp; &lt;body&gt;</p>
        <h1>Joachim Cishugi</h1>
        <p>Développeur web et logiciel</p>
        <p>J’aime imaginer et coder des choses qui donnent le sourire.</p>
        <button type="button" onClick={skipIntro}>Charger le style</button>
        <p>&nbsp; &lt;/body&gt;</p>
        <p>&lt;/html&gt;</p>
      </section>

      <div className="designedPage">
        <div className="digitalRain" aria-hidden="true">
          {RAIN_GLYPHS.map((glyph, index) => (
            <span
              key={`${glyph}-${index}`}
              style={{
                left: `${(index * 17 + 4) % 100}%`,
                animationDelay: `-${(index % 8) * 1.1}s`,
                animationDuration: `${4.8 + (index % 4) * 0.7}s`,
              }}
            >
              {glyph}
            </span>
          ))}
        </div>
        <nav className="siteNav" aria-label="Navigation principale">
          <a className="brand" href="#accueil" aria-label="Accueil de Joachim Cishugi">JC<span>.</span></a>
          <a href="#projets">Projets</a>
          <a href="#apropos">À propos</a>
          <a href="#contact">Contact</a>
        </nav>

        <section className="hero" id="accueil">
          <p className="heroKicker">Portfolio / 2026</p>
          <div className="identityWrap" aria-live="polite">
            <p className="identityLabel">Je suis</p>
            <h1 key={identityIndex} className="identityName">
              {identityIndex >= 0 ? IDENTITIES[identityIndex] : ""}
            </h1>
            {identityIndex === IDENTITIES.length - 1 && (
              <p className="identityJoke">Je déconne, je suis Joachim Cishugi.</p>
            )}
          </div>
          <p className="heroRole">Développeur web <em>et</em> logiciel</p>
          <p className="heroIntro">J’assemble des idées, des interfaces et juste assez de chaos pour que tout reste vivant...</p>
          <button
            className="textButton"
            type="button"
            aria-expanded={isSummaryOpen}
            onClick={() => setIsSummaryOpen((value) => !value)}
          >
            {isSummaryOpen ? "Refermer" : "Voir plus"} <span>↓</span>
          </button>
          <div className={`summaryReveal ${isSummaryOpen ? "summaryReveal--open" : ""}`}>
            <p>EN BREF : TANT QU’IL Y A ARGENT JE PEUX TOUT CODER ! même Facebook...</p>
          </div>
        </section>

        <section className="projects" id="projets">
          <div className="sectionHeading">
            <p className="sectionNumber">01 — 04</p>
            <h2>Quelques trucs que j’ai <em>fabriqués.</em></h2>
          </div>
          <div className="projectGrid">
            {PROJECTS.map((project) => (
              <button
                className={`projectCard ${project.id === "archives" ? "projectCard--archives" : ""}`}
                key={project.id}
                type="button"
                onClick={() => setSelectedProject(project)}
                aria-label={`Voir le message pour ${project.title}`}
              >
                <span className="projectNumber">{project.number}</span>
                <span className="projectArrow">↗</span>
                <strong>{project.title}</strong>
                <span className="projectCategory">{project.category}</span>
                <span className="projectDescription">{project.description}</span>
                {project.tags && <span className="projectTags">{project.tags.join(" · ")}</span>}
              </button>
            ))}
          </div>
        </section>

        <section className="about" id="apropos">
          <div className="aboutTitle">
            <p className="sectionNumber">01.</p>
            <h2>À propos</h2>
          </div>
          <div className="aboutCopy">
            <p className="aboutLabel">IDENTITÉ</p>
            <div className="aboutText" aria-live="polite">
              {isHonestAbout ? (
                <>
                  <p className="aboutLead">Je suis Joachim Cishugi. Je ne maîtrise pas tout et je ne vais pas prétendre le contraire.</p>
                  <p>Je passe une bonne partie de mon temps à apprendre, tester, casser, réparer et recommencer jusqu’à ce qu’une idée beaucoup trop ambitieuse finisse par fonctionner.</p>
                  <p>Je développe principalement avec TypeScript, React, Next.js, PostgreSQL, n8n et différents outils d’intelligence artificielle. J’utilise aussi Google comme tous les développeurs honnêtes de cette planète.</p>
                  <p>Ce qui m’intéresse réellement, ce n’est pas d’empiler les technologies pour impressionner trois recruteurs. C’est de transformer une idée en quelque chose d’utile, de clair et suffisamment original pour qu’on s’en souvienne.</p>
                </>
              ) : (
                <>
                  <p className="aboutLead">Je suis Joachim, développeur web basé au Canada.</p>
                  <p>Je développe principalement avec React, Next.js et TypeScript. J’aime transformer des idées inhabituelles en produits simples, cohérents et réellement utilisables.</p>
                </>
              )}
            </div>
            <button className="truthButton" type="button" onClick={() => setIsHonestAbout((value) => !value)}>
              {isHonestAbout ? "Revenir à la version poétique" : "Voir la pure vérité"} <span>→</span>
            </button>
          </div>
        </section>

        <section className="contact" id="contact">
          <p className="sectionNumber">03.</p>
          <div>
            <h2>Travaillons ensemble</h2>
            <p>Une idée sérieuse, étrange ou honteusement ambitieuse peut probablement devenir une application.</p>
          </div>
          <a href="mailto:cishugijoachim@gmail.com">cishugijoachim@gmail.com</a>
        </section>

        <footer><span>© 2026 Joachim Cishugi</span><span>Le CSS a finalement été retrouvé.</span></footer>
      </div>

      <ProjectModal
        isOpen={selectedProject !== null}
        message={selectedProject?.modalMessage ?? ""}
        onClose={closeModal}
      />
    </main>
  );
}

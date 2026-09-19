"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

const INTRO_TIMING = {
  characterEnter: 4800,
  cssStart: 6000,
  centerReached: 9000,
  centerPauseEnd: 11000,
  cssComplete: 14000,
  characterExit: 17000,
  characterFade: 16000,
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
  url?: string;
  githubUrl?: string;
  modalMessage: string;
};

const PROJECTS: Project[] = [
  {
    id: "kimia",
    number: "01",
    title: "Kimia",
    category: "Cosmétiques et rituels de beauté",
    description: "Une boutique pensée pour découvrir des soins, des produits et des rituels de beauté.",
    tags: ["Next.js", "E-commerce"],
    url: "https://kimia0.vercel.app/",
    githubUrl: "https://github.com/Emynado01/Kimia0",
    modalMessage: "Site trop moche pour être vu.",
  },
  {
    id: "anansi",
    number: "02",
    title: "ANANSI",
    category: "Bibliothèque sonore privée",
    description: "Des histoires à emporter, sans bruit autour.",
    tags: ["Audio", "Cloud"],
    url: "https://anansi01.vercel.app/",
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
    id: "blog-jc",
    number: "04",
    title: "BlogJC",
    category: "Articles juridiques et publication",
    description: "Un blog où l’administration publie et organise des articles de droit.",
    tags: ["Next.js", "Blog"],
    url: "https://blog-jc-tau.vercel.app/",
    githubUrl: "https://github.com/Emynado01/BlogJC",
    modalMessage: "Site trop moche pour être vu.",
  },
  {
    id: "pensee-du-jour",
    number: "05",
    title: "Pensée du jour",
    category: "Une pause dans le quotidien",
    description: "Des pensées et des énigmes à découvrir, un jour à la fois.",
    tags: ["Next.js", "Éditorial"],
    url: "https://pensed-jour.vercel.app/",
    githubUrl: "https://github.com/Emynado01/PensedJour",
    modalMessage: "Site trop moche pour être vu.",
  },
  {
    id: "archives",
    number: "06",
    title: "Voir plus de projets",
    category: "Archives plus ou moins terminées",
    description: "Quelques autres idées que mon cerveau a refusé de laisser tranquilles.",
    githubUrl: "https://github.com/Emynado01?tab=repositories",
    modalMessage: "Crois-moi, j’ai beaucoup de projets... Jamais finis.",
  },
];

type ProjectModalProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
};

function ProjectModal({ isOpen, message, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className="modalBackdrop" onCancel={onClose}
      aria-labelledby="project-modal-title" aria-modal="true"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section
        className="projectModal"
      >
        <button className="modalClose" type="button" onClick={onClose} aria-label="Fermer la fenêtre">
          ×
        </button>
        <div className="joachimIcon joachimIcon--pose">
          <Image
            src="/IconePose.png"
            alt="Joachim"
            width={88}
            height={88}
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
    </dialog>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<"raw" | "enter" | "walk" | "repair" | "finish" | "ready">("raw");
  const isStyled = phase === "ready";
  const isInstalling = phase === "walk" || phase === "repair" || phase === "finish";
  const [showCharacter, setShowCharacter] = useState(false);
  const [identityIndex, setIdentityIndex] = useState(-1);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isHonestAbout, setIsHonestAbout] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMotionPaused, setIsMotionPaused] = useState(false);
  const portfolioRef = useRef<HTMLElement>(null);
  const frameRef = useRef(0);
  const stoppedRef = useRef(false);

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));

    return () => {
      window.cancelAnimationFrame(frame);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  const skipIntro = useCallback(() => {
    stoppedRef.current = true;
    cancelAnimationFrame(frameRef.current);
    portfolioRef.current?.style.setProperty("--reveal", "100%");
    setPhase("ready");
    setShowCharacter(false);
    setIdentityIndex(IDENTITIES.length - 1);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => { if (reducedMotion.matches) skipIntro(); };
    stoppedRef.current = false;
    const start = performance.now();
    const end = INTRO_TIMING.cssComplete + INTRO_TIMING.identityInterval * (IDENTITIES.length - 1);
    const tick = (now: number) => {
      if (stoppedRef.current) return;
      const elapsed = now - start;
      const t = INTRO_TIMING;
      const nextPhase = elapsed < t.characterEnter ? "raw" : elapsed < t.cssStart ? "enter" : elapsed < t.centerReached ? "walk" : elapsed < t.centerPauseEnd ? "repair" : elapsed < t.cssComplete ? "finish" : "ready";
      // One clock drives the CSS frontier and the character; repair holds both at 50%.
      const progress = elapsed < t.cssStart ? 0 : elapsed < t.centerReached ? .5 * (elapsed - t.cssStart) / (t.centerReached - t.cssStart) : elapsed < t.centerPauseEnd ? .5 : Math.min(1, .5 + .5 * (elapsed - t.centerPauseEnd) / (t.cssComplete - t.centerPauseEnd));
      const characterPosition = elapsed < t.cssStart
        ? -10 + 10 * Math.max(0, (elapsed - t.characterEnter) / (t.cssStart - t.characterEnter))
        : progress * 100;
      const style = portfolioRef.current?.style;
      style?.setProperty("--reveal", `${progress * 100}%`);
      style?.setProperty("--character-x", `${characterPosition}%`);
      style?.setProperty("--character-inset", `${Math.max(0, progress - .5) * 138}px`);
      style?.setProperty("--character-opacity", `${Math.max(0, Math.min(1, (t.characterExit - elapsed) / (t.characterExit - t.characterFade)))}`);
      setPhase(nextPhase);
      setShowCharacter(elapsed >= t.characterEnter && elapsed < t.characterExit);
      setIdentityIndex(elapsed < t.cssComplete ? -1 : Math.min(IDENTITIES.length - 1, Math.floor((elapsed - t.cssComplete) / t.identityInterval)));
      if (elapsed < end) frameRef.current = requestAnimationFrame(tick);
    };
    if (reducedMotion.matches) frameRef.current = requestAnimationFrame(skipIntro);
    else frameRef.current = requestAnimationFrame(tick);
    reducedMotion.addEventListener("change", onMotionChange);
    return () => {
      stoppedRef.current = true;
      cancelAnimationFrame(frameRef.current);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, [skipIntro]);

  useLayoutEffect(() => {
    if (isStyled) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    resetScroll();
    window.addEventListener("pageshow", resetScroll);
    window.addEventListener("scroll", resetScroll, { passive: true });
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("pageshow", resetScroll);
      window.removeEventListener("scroll", resetScroll);
    };
  }, [isStyled]);

  const closeModal = useCallback(() => setSelectedProject(null), []);

  return (
    <main ref={portfolioRef} data-phase={phase} className={`portfolio ${isInstalling ? "portfolio--installing" : ""} ${isStyled ? "portfolio--ready" : ""} ${isMotionPaused ? "portfolio--still" : ""}`}>
      {!isStyled && (
        <button className="skipIntro" type="button" onClick={skipIntro}>
          Passer l’introduction
        </button>
      )}

        <div hidden={!showCharacter} className={`characterRunner ${phase === "repair" ? "characterRunner--repair" : ""}`} aria-hidden="true">
          <Image className="characterImage characterImage--walk" src="/IconeMarche.png" alt="" width={138} height={138} priority />
          <Image className="characterImage characterImage--repair" src="/IconeRepare.png" alt="" width={138} height={138} priority />
          <span className="characterSpeech">{phase === "enter" ? "Qui a volé le CSS ?!" : phase === "repair" ? "Attends… je répare." : phase === "ready" ? "Voilà. Ni vu ni connu." : "Un peu de style…"}</span>
        </div>

      {!isStyled && <div className="introProgress" role="status"><span>{phase === "raw" ? "Le CSS est introuvable." : phase === "repair" ? "02 / Petite réparation au centre" : "01 / Installation du style"}</span><div><span /></div></div>}

      <section className="rawPage" aria-label="Page en cours de mise en forme">
        <p>&lt;!DOCTYPE html&gt;</p>
        <p>&lt;html lang=&quot;fr&quot;&gt;</p>
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

      <div className="designedPage" inert={!isStyled} aria-hidden={!isStyled}>
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
          <a className="navGithub" href="https://github.com/Emynado01" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </nav>

        <section className="hero" id="accueil">
          <p className="heroKicker">Portfolio / 2026</p>
          <div className="identityWrap" aria-live="polite">
            <p className="identityLabel">Je suis</p>
            <h1 key={identityIndex} className="identityName">
              {identityIndex >= 0 ? IDENTITIES[identityIndex] : "Joachim Cishugi"}
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
            <p className="sectionNumber">01 / PROJETS CHOISIS</p>
            <h2>Quelques trucs que j’ai <em>fabriqués.</em></h2>
          </div>
          <p className="projectsIntro">Des idées devenues des interfaces. À explorer en ligne ou dans le code.<span>Les liens externes s’ouvrent dans un nouvel onglet.</span></p>
          <div className="projectGrid">
            {PROJECTS.map((project) => (
              <article
                className={`projectCard ${project.id === "archives" ? "projectCard--archives" : ""}`}
                key={project.id}
              >
                <span className="projectNumber">{project.number}</span>
                <span className="projectState">{project.url ? "En ligne" : project.id === "archives" ? "Explorations" : "En atelier"}</span>
                <h3>{project.title}</h3>
                <span className="projectCategory">{project.category}</span>
                <span className="projectDescription">{project.description}</span>
                {project.tags && <span className="projectTags">{project.tags.join(" · ")}</span>}
                <div className="projectLinks">
                  {project.url ? <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Voir le site ${project.title} (nouvel onglet)`}>Voir le site <span aria-hidden="true">↗</span></a> : <button type="button" onClick={() => setSelectedProject(project)}>{project.id === "archives" ? "L’explication" : "Dans les coulisses"} <span aria-hidden="true">→</span></button>}
                  {project.githubUrl ? <a className="projectSource" href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`Code GitHub — ${project.title} (nouvel onglet)`}>{project.id === "archives" ? "Tous les dépôts" : "Code GitHub"} <span aria-hidden="true">↗</span></a> : <span className="privateSource">Code privé</span>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about" id="apropos">
          <div className="aboutTitle">
            <p className="sectionNumber">02.</p>
            <h2>À propos</h2>
          </div>
          <div className="aboutCopy">
            <p className="aboutLabel">IDENTITÉ</p>
            <div key={String(isHonestAbout)} className="aboutText" aria-live="polite">
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

        <footer><span>© 2026 Joachim Cishugi</span><a href="https://github.com/Emynado01/PortofolioJC" target="_blank" rel="noopener noreferrer">Le code de ce site ↗</a><button type="button" onClick={() => setIsMotionPaused((value) => !value)} aria-pressed={isMotionPaused}>{isMotionPaused ? "Reprendre le fond animé" : "Mettre le fond en pause"}</button></footer>
      </div>

      <ProjectModal
        isOpen={selectedProject !== null}
        message={selectedProject?.modalMessage ?? ""}
        onClose={closeModal}
      />
    </main>
  );
}

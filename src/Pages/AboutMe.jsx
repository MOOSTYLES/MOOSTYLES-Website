import { Heart, Globe, Mail, Download, Trophy } from 'lucide-react';
import { NavigationBar } from '@/Components/NavigationBar';
import { Footer } from '@/Components/Footer';
import { WebsiteBackground } from '@/Components/WebsiteBackground';
import { Metadata } from '@/Components/Metadata.jsx';
import { Breadcrumb } from '@/Components/mods/Breadcrumb';

const achievements = [
  {
    icon: Download,
    title: "First Mod!",
    description: "Creating my very first mod, the 'MOCA Cafe Brand'",
  },
  {
    icon: Trophy,
    title: "100k Downloads on CurseForge",
    description: "Every mod on this site is free, and players have downloaded them over 100,000 times.",
    caption: "Thank you for building with us!",
  },
];

const values = [
  {
    title: "Free Access",
    description: "All our mods are completely free to download and use. We believe in making quality mods accessible to everyone.",
  },
  {
    title: "Quality",
    description: "Every mod is carefully crafted and tested to ensure compatibility and enhance your InZoi gaming experience.",
  },
  {
    title: "Community",
    description: "We believe in building a supportive community where modders and players can share, learn, and grow together.",
  },
  {
    title: "Innovation",
    description: "We stay ahead of trends and game updates to bring you the latest and most innovative mods for InZoi.",
  },
];

const AboutMe = () => {
  return (
    <div className="min-h-screen">
      <Metadata />
      <WebsiteBackground />
      <NavigationBar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb to="/" label="Home" />

        <h1 className="mod-detail__title mods-index__title newdesign-heading newdesign-brand-label">
          About MOOSTYLES
        </h1>
        <p className="about-page__intro">
          Your premier destination for high-quality InZoi mods. We're passionate about creating and
          sharing amazing mods that enhance your InZoi gaming experience, completely free of charge.
        </p>

        <section className="about-page__section">
          <div className="about-page__grid">
            <div className="about-page__body">
              <h2 className="about-page__section-title">My Story</h2>
              <p>
                Hi! I'm the creator behind MOOSTYLES, and I'm passionate about InZoi modding. What
                started as a personal hobby of creating mods for my own gameplay has evolved into a
                mission to share amazing mods with the entire InZoi community.
              </p>
              <p>
                You can learn more about me and my other projects by visiting{" "}
                <a href="https://moocalf.com" target="_blank" rel="noopener noreferrer">Moocalf.com</a>,
                where I share my journey, tutorials, and connect with fellow modders and gamers.
              </p>
              <p>
                MOOSTYLES was created with one simple goal: to make high-quality InZoi mods accessible
                to everyone, completely free. I believe that modding should be about creativity,
                community, and enhancing the gaming experience for all players.
              </p>
            </div>

            <div className="about-page__mission-card">
              <h3 className="about-page__mission-title">My Mission</h3>
              <p className="about-page__mission-body">
                To create and share amazing InZoi mods that enhance gameplay, foster creativity, and
                build a supportive modding community where everyone can enjoy the game to its fullest
                potential.
              </p>
            </div>
          </div>
        </section>

        <section className="about-page__section">
          <h2 className="about-page__section-title">My Achievements</h2>
          <div className="about-page__cards">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <div key={achievement.title} className="about-page__card">
                  <IconComponent className="about-page__card-icon" size={32} aria-hidden="true" />
                  <h3 className="about-page__card-title">{achievement.title}</h3>
                  <p className="about-page__card-description">{achievement.description}</p>
                  {achievement.caption && (
                    <p className="about-page__card-caption">{achievement.caption}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="about-page__section">
          <h2 className="about-page__section-title">My Values</h2>
          <div className="about-page__cards">
            {values.map((value) => (
              <div key={value.title} className="about-page__value-card">
                <h3 className="about-page__value-title">{value.title}</h3>
                <p className="about-page__value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-page__section">
          <h2 className="about-page__section-title">Let's Connect</h2>
          <p className="about-page__intro">
            Have questions about mods or want to share your MOOSTYLES experience? I'd love to hear from
            you! Follow me on social media for updates and mod releases.
          </p>
          <div className="about-page__connect">
            <a href="mailto:hello@moocalf.com" className="about-page__connect-button">
              <Mail size={18} aria-hidden="true" />
              Email Me
            </a>
            <a
              href="https://moocalf.com"
              target="_blank"
              rel="noopener noreferrer"
              className="about-page__connect-button"
            >
              <Globe size={18} aria-hidden="true" />
              Visit Moocalf.com
            </a>
            <a
              href="https://www.patreon.com/MOOSTYLES"
              target="_blank"
              rel="noopener noreferrer"
              className="about-page__connect-button about-page__connect-button--accent"
            >
              <Heart size={18} aria-hidden="true" />
              Support on Patreon
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutMe;

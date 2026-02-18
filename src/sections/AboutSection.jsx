import { Canvas } from '@react-three/fiber';
import { Float, TorusKnot } from '@react-three/drei';
import { personalInfo, skills } from '../lib/content';

function AccentShape() {
  return (
    <Float speed={1.2} floatIntensity={0.7} rotationIntensity={0.7}>
      <TorusKnot args={[0.7, 0.25, 120, 24]}>
        <meshStandardMaterial color="#74f4ff" emissive="#165572" roughness={0.35} metalness={0.65} />
      </TorusKnot>
    </Float>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="section-shell">
      <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr]">
        <article className="glass-panel p-8 sm:p-10">
          <h2 className="section-title">About</h2>
          <div className="section-copy space-y-4">
            {personalInfo.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-slate-200 transition hover:-translate-y-0.5 hover:border-accent/70 hover:text-accent"
              >
                {skill}
              </span>
            ))}
          </div>
        </article>

        <aside className="glass-panel relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-noise opacity-60" aria-hidden="true" />
          <div className="relative h-60 sm:h-72">
            <Canvas camera={{ position: [0, 0, 3.5], fov: 55 }} dpr={[1, 1.5]}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 2, 2]} intensity={1.3} color="#84ecff" />
              <AccentShape />
            </Canvas>
          </div>
          <div className="relative mt-4 space-y-2 text-sm text-slate-300">
            <p>
              <span className="text-slate-500">Location:</span> {personalInfo.location}
            </p>
            <p>
              <span className="text-slate-500">Status:</span> {personalInfo.availability}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

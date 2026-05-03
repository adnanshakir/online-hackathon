import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as _motion, AnimatePresence } from 'motion/react';
const Motion = _motion;
import {
  Plus,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Layers,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Server,
  Globe,
  Database,
  Cloud,
  Link,
  Settings,
  Monitor,
  HardDrive,
  Shield,
  Layout,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/shared/Logo';
import { fadeUp, stagger, scaleIn } from '@/components/motion/variants';
import { toast } from 'sonner';
import { services } from '@/lib/api';
import { AmbientGlow } from '@/components/shared/AmbientGlow';
import { cn } from '@/lib/utils';

const ENVIRONMENTS = [
  { id: 'production', name: 'Production', color: 'bg-rose-500' },
  { id: 'staging', name: 'Staging', color: 'bg-amber-500' },
  { id: 'dev', name: 'Development', color: 'bg-blue-500' },
];

export default function ServiceSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'backend',
    techStack: '',
    environment: 'production',
    description: '',
    repoUrl: '',
    liveUrl: '',
  });

  const updateForm = (key, val) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Client-side validation
    if (!formData.name.trim()) return toast.error('Service name is required');
    if (!formData.techStack.trim())
      return toast.error('Tech stack is required');

    // URL Validation if provided
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (formData.repoUrl && !urlPattern.test(formData.repoUrl)) {
      return toast.error('Please enter a valid Repository URL');
    }
    if (formData.liveUrl && !urlPattern.test(formData.liveUrl)) {
      return toast.error('Please enter a valid Live URL');
    }

    setLoading(true);
    try {
      const techArray = formData.techStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await services.create({
        ...formData,
        techStack: techArray,
      });
      setStep(3);
      toast.success('Service fully configured');
    } catch (err) {
      // Show specific validation error if available, else generic message
      const firstError = err.response?.data?.errors?.[0]?.message;
      const msg =
        firstError || err.response?.data?.message || 'Failed to create service';
      toast.error(msg);

      if (err.response?.data?.errors) {
        console.error('Validation errors:', err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    navigate('/app/dashboard');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-background)] px-6 py-12">
      <AmbientGlow variant="landing" />

      <div className="absolute top-8 left-8">
        <Logo />
      </div>

      <div className="z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Motion.div
              key="step1"
              variants={stagger(0.1, 0.1)}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              <Motion.div
                variants={fadeUp}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-primary)]"
              >
                <Settings className="h-3 w-3" />
                Step 1: Core Context
              </Motion.div>

              <Motion.h1
                variants={fadeUp}
                className="text-4xl font-semibold tracking-tight text-[var(--color-foreground)]"
              >
                What are we managing?
              </Motion.h1>

              <Motion.div
                variants={fadeUp}
                className="mt-8 space-y-8 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 shadow-2xl"
              >
                {/* Simplified Header */}
                <div className="flex items-center gap-4 rounded-xl bg-[var(--color-brand-primary)]/5 p-4 border border-[var(--color-brand-primary)]/10">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-[var(--color-brand-primary)]/20 text-[var(--color-brand-primary)]">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-foreground)]">
                      Full Website Stack
                    </h3>
                    <p className="text-xs text-[var(--color-muted)]">
                      Unified management for Frontend, Backend, Database, and
                      Infra.
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    What is the name of this project?
                  </Label>
                  <Input
                    placeholder="e.g. My Awesome Website"
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="h-14 bg-[var(--color-background)] text-lg border-[var(--color-border-strong)] focus:border-[var(--color-brand-primary)]"
                  />
                </div>

                {/* Environment */}
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    Target Environment
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {ENVIRONMENTS.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => updateForm('environment', e.id)}
                        className={cn(
                          'flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-bold transition-all',
                          formData.environment === e.id
                            ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] ring-1 ring-[var(--color-brand-primary)]'
                            : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-muted)] hover:bg-[var(--color-surface-elevated)]'
                        )}
                      >
                        <span className={cn('size-2 rounded-full', e.color)} />
                        {e.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => {
                    if (!formData.name)
                      return toast.error('Please name your service');
                    // Ensure full stack defaults are set if they were bypassed
                    setFormData((prev) => ({
                      ...prev,
                      type: 'backend', // canonical type for full stack in backend
                      techStack:
                        prev.techStack ||
                        'Frontend, Backend, Database, Cloud Infra',
                    }));
                    setStep(2);
                  }}
                  className="w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-[var(--color-brand-primary)]/10"
                >
                  Continue to Details <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Motion.div>
            </Motion.div>
          )}

          {step === 2 && (
            <Motion.div
              key="step2"
              variants={stagger(0.1, 0.1)}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              <Motion.div
                variants={fadeUp}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-primary)]"
              >
                <Sparkles className="h-3 w-3" />
                Step 2: Technical Context
              </Motion.div>

              <Motion.h1
                variants={fadeUp}
                className="text-4xl font-semibold tracking-tight text-[var(--color-foreground)]"
              >
                Technical Blueprint
              </Motion.h1>

              <Motion.form
                variants={fadeUp}
                onSubmit={handleSubmit}
                className="mt-8 space-y-6 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] p-8 shadow-2xl"
              >
                <div className="space-y-3">
                  <Label>Tech Stack</Label>
                  <Input
                    placeholder="Node.js, Express, MongoDB, Redis"
                    value={formData.techStack}
                    onChange={(e) => updateForm('techStack', e.target.value)}
                    className="h-12 bg-[var(--color-background)]"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    placeholder="What does this service do?"
                    value={formData.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    className="min-h-[80px] bg-[var(--color-background)]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Link className="size-3 text-[var(--color-muted)]" /> Repo
                      URL
                    </Label>
                    <Input
                      placeholder="https://github.com/..."
                      value={formData.repoUrl}
                      onChange={(e) => updateForm('repoUrl', e.target.value)}
                      className="bg-[var(--color-background)]"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Link className="size-3 text-[var(--color-muted)]" /> Live
                      URL
                    </Label>
                    <Input
                      placeholder="https://api.acme.com"
                      value={formData.liveUrl}
                      onChange={(e) => updateForm('liveUrl', e.target.value)}
                      className="bg-[var(--color-background)]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    variant="gradient"
                    type="submit"
                    className="flex-[2] h-12"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Complete Setup <CheckCircle className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Motion.form>
            </Motion.div>
          )}

          {step === 3 && (
            <Motion.div
              key="step3"
              variants={stagger(0.1, 0.1)}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <Motion.div
                variants={scaleIn}
                className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] shadow-[0_0_50px_-15px_rgba(var(--color-brand-primary-rgb),0.6)]"
              >
                <CheckCircle className="h-12 w-12" />
              </Motion.div>
              <Motion.h1
                variants={fadeUp}
                className="text-5xl font-semibold tracking-tight text-[var(--color-foreground)]"
              >
                Command Center Ready
              </Motion.h1>
              <Motion.p
                variants={fadeUp}
                className="mt-5 text-lg text-[var(--color-muted-strong)] max-w-sm mx-auto leading-relaxed"
              >
                Your service is now under watch. Everything is in place for your
                first incident report.
              </Motion.p>

              <Motion.div variants={fadeUp} className="mt-12">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleFinish}
                  className="px-12 h-14 text-base font-semibold shadow-xl shadow-[var(--color-brand-primary)]/20 rounded-2xl"
                >
                  Enter Dashboard <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Motion.div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
    </div>
  );
}

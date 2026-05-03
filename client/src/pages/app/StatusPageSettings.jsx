import { useState, useEffect } from 'react';
import { motion as _motion } from 'motion/react';
const Motion = _motion;
import {
  Globe,
  Layout,
  Palette,
  Shield,
  Bell,
  Eye,
  ExternalLink,
  Save,
  Image as ImageIcon,
  MessageSquareWarning,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { fadeUp } from '@/components/motion/variants';
import * as api from '@/lib/api';
import { Switch } from '@/components/ui/switch';

export default function StatusPageSettings() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State
  const [settings, setSettings] = useState({
    siteName: 'OpsWatch Status',
    slug: '',
    theme: 'dark',
    logo: null,
    showUptime: true,
    showIncidents: true,
    showSubscribers: true,
    announcement: {
      message: '',
      type: 'info',
      isActive: false,
    },
    insights: {
      visitors24h: 0,
      subscribers: 0,
    },
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api.getStatusPageSettings();
        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
            announcement: {
              ...prev.announcement,
              ...(data.announcement || {}),
            },
            insights: {
              ...prev.insights,
              ...(data.insights || {}),
            },
          }));
        }
      } catch {
        toast.error('Failed to load status page settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = await api.updateStatusPageSettings(settings);
      setSettings((prev) => ({
        ...prev,
        ...data,
      }));
      toast.success('Status page settings saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const previewUrl = `${window.location.origin}/s/${settings.slug}`;

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-muted)]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header with Preview Link */}
      <Motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/20 mb-4">
            <Globe className="h-3 w-3 text-[var(--color-brand-primary)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-primary)]">
              Public Presence
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Status Page</h1>
          <p className="text-[var(--color-muted)] mt-2">
            Configure your customer-facing uptime dashboard and incident feed.
          </p>
        </div>

        <Button
          variant="outline"
          className="gap-2 group"
          asChild
          disabled={!settings.slug}
        >
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            <Eye className="h-4 w-4" />
            View Public Page
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
          </a>
        </Button>
      </Motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Config Card */}
          <Motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 border-t-2 border-t-[var(--color-brand-primary)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-brand-primary)]">
                  <Layout className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">General Configuration</h3>
                  <p className="text-xs text-[var(--color-muted)]">
                    Identity and access settings for your status page.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                    Site Name
                  </label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                    placeholder="e.g. OpsWatch Global Status"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                    Custom Slug
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm text-[var(--color-muted)] pointer-events-none">
                      <span>{window.location.host}/s/</span>
                    </div>
                    <Input
                      value={settings.slug}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ''),
                        })
                      }
                      className="pl-[140px]"
                      placeholder="your-company"
                    />
                  </div>
                  <p className="text-[10px] text-[var(--color-muted)]">
                    Only letters, numbers, and hyphens allowed. This is the URL
                    clients will visit.
                  </p>
                </div>
              </div>
            </Card>
          </Motion.div>

          {/* Public Announcement */}
          <Motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 border border-blue-500/20 bg-blue-500/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <MessageSquareWarning className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-100">
                      Public Announcement
                    </h3>
                    <p className="text-xs text-blue-300/70">
                      Display a prominent banner on the status page.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-blue-300/70">
                    Active
                  </span>
                  <Switch
                    checked={settings.announcement.isActive}
                    onCheckedChange={(v) =>
                      setSettings((s) => ({
                        ...s,
                        announcement: { ...s.announcement, isActive: v },
                      }))
                    }
                  />
                </div>
              </div>

              {settings.announcement.isActive && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid gap-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-blue-300/70">
                      Message (Markdown supported)
                    </label>
                    <Textarea
                      value={settings.announcement.message}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          announcement: {
                            ...s.announcement,
                            message: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g. We are currently experiencing degraded performance..."
                      className="min-h-[100px] bg-[var(--color-surface)]"
                    />
                  </div>

                  <div className="flex gap-3">
                    {['info', 'warning', 'critical'].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setSettings((s) => ({
                            ...s,
                            announcement: { ...s.announcement, type },
                          }))
                        }
                        className={`flex-1 p-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                          settings.announcement.type === type
                            ? type === 'critical'
                              ? 'bg-red-500/20 border-red-500 text-red-400'
                              : type === 'warning'
                                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                : 'bg-blue-500/20 border-blue-500 text-blue-400'
                            : 'bg-transparent border-[var(--color-border)] text-[var(--color-muted)] hover:border-blue-500/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </Motion.div>

          {/* Appearance & Branding */}
          <Motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[var(--color-surface-elevated)] text-pink-400">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Branding & Style</h3>
                  <p className="text-xs text-[var(--color-muted)]">
                    Customize the look and feel of your dashboard.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                    Brand Logo
                  </label>
                  <div className="aspect-square w-32 rounded-2xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-2 hover:border-[var(--color-brand-primary)]/50 transition-colors cursor-pointer group">
                    <div className="p-3 rounded-full bg-[var(--color-surface-elevated)] group-hover:scale-110 transition-transform">
                      <ImageIcon className="h-6 w-6 text-[var(--color-muted)]" />
                    </div>
                    <span className="text-[10px] font-medium text-[var(--color-muted)]">
                      Upload SVG/PNG
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                    Theme Mode
                  </label>
                  <div className="flex gap-3">
                    {['dark', 'light', 'system'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() =>
                          setSettings({ ...settings, theme: mode })
                        }
                        className={`flex-1 p-4 rounded-xl border transition-all ${
                          settings.theme === mode
                            ? 'bg-[var(--color-surface-elevated)] border-[var(--color-brand-primary)] shadow-lg shadow-[var(--color-brand-primary)]/10'
                            : 'border-[var(--color-border)] hover:border-[var(--color-muted)]'
                        }`}
                      >
                        <span
                          className={`text-xs font-bold capitalize ${settings.theme === mode ? 'text-[var(--color-foreground)]' : 'text-[var(--color-muted)]'}`}
                        >
                          {mode}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Motion.div>

          {/* Toggles / Components */}
          <Motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[var(--color-surface-elevated)] text-amber-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Visibility Settings</h3>
                  <p className="text-xs text-[var(--color-muted)]">
                    Toggle which sections are visible to the public.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[var(--color-border)]">
                {[
                  {
                    id: 'showUptime',
                    title: 'Uptime History',
                    desc: 'Show 90-day availability charts for each service.',
                  },
                  {
                    id: 'showIncidents',
                    title: 'Incident Feed',
                    desc: 'Display a list of active and past incidents.',
                  },
                  {
                    id: 'showSubscribers',
                    title: 'Email Subscriptions',
                    desc: 'Allow users to sign up for status updates.',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <p className="text-xs text-[var(--color-muted)]">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      checked={settings[item.id]}
                      onCheckedChange={(v) =>
                        setSettings({ ...settings, [item.id]: v })
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          </Motion.div>
        </div>

        {/* Right Column: Quick Stats & Save */}
        <div className="space-y-6">
          <Motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-elevated)] border-none shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                  <Save className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm uppercase tracking-wider">
                  Save Changes
                </h3>
              </div>

              <p className="text-xs text-[var(--color-muted)] mb-6">
                Updates to the public status page are instantaneous once saved.
                Ensure all branding is correct.
              </p>

              <Button
                className="w-full h-12 text-sm font-bold tracking-tight transition-all active:scale-[0.98]"
                variant="gradient"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  'Publish Updates'
                )}
              </Button>
            </Card>
          </Motion.div>

          {/* Quick Insights */}
          <Motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 overflow-hidden relative group">
              <div className="absolute -right-4 -top-4 size-24 bg-[var(--color-brand-primary)]/10 rounded-full blur-3xl transition-all group-hover:scale-150" />

              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] mb-4">
                Page Insights
              </h4>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)]">
                    Visitors (24h)
                  </span>
                  <span className="text-sm font-mono font-bold">
                    {settings.insights.visitors24h}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)]">
                    Subscribers
                  </span>
                  <span className="text-sm font-mono font-bold text-[var(--color-brand-primary)]">
                    {settings.insights.subscribers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)]">
                    Status
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
                    <span className="text-[10px] font-bold uppercase text-[var(--color-brand-primary)]">
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Motion.div>
        </div>
      </div>
    </div>
  );
}

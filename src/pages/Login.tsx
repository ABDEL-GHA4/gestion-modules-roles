import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Lock, LogIn } from "lucide-react";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [welcomeExiting, setWelcomeExiting] = useState(false);
  const [showSplit, setShowSplit] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setWelcomeExiting(true), 2900);
    const t2 = setTimeout(() => setShowSplit(true), 3450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs
    if (!username.trim() || !password.trim()) {
      toast.error("Champs requis", {
        description: "Veuillez remplir tous les champs",
        icon: <XCircle size={20} />,
        duration: 4000,
        className: "toast-error-login",
      });
      return;
    }

    setIsLoading(true);

    // Toast de chargement
    const loadingToastId = toast.loading("Connexion en cours...", {
      description: "Vérification de vos identifiants",
      icon: <div className="toast-loading-spinner" />,
      duration: Infinity,
    });

    // Simuler un délai de connexion pour voir l'animation
    setTimeout(async () => {
      const success = await login(username, password);

      // Fermer le toast de chargement
      toast.dismiss(loadingToastId);

      if (success) {
        const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

        // Toast de succès avec animation
        toast.success("Connexion réussie !", {
          description: `Bienvenue ${user.username || username}`,
          icon: <CheckCircle2 size={20} />,
          duration: 3000,
          className: "toast-success-login",
          action: {
            label: "Dashboard",
            onClick: () => {
              if (user.role === "admin") navigate("/admin/modules");
              else if (user.role === "manager") navigate("/manager/roles");
              else if (user.role === "agent") navigate("/agent/dashboard");
            },
          },
        });

        // Navigation après un court délai pour voir le toast
        setTimeout(() => {
          if (user.role === "admin") navigate("/admin/modules");
          else if (user.role === "manager") navigate("/manager/roles");
          else if (user.role === "agent") navigate("/agent/dashboard");
        }, 800);
      } else {
        // Toast d'erreur avec animation shake
        toast.error("Échec de connexion", {
          description: "Nom d'utilisateur ou mot de passe incorrect",
          icon: <Lock size={20} />,
          duration: 5000,
          className: "toast-error-login",
          action: {
            label: "Réessayer",
            onClick: () => {
              setPassword("");
              document.getElementById("password")?.focus();
            },
          },
        });
      }

      setIsLoading(false);
    }, 1200); // Délai pour voir l'animation de chargement
  };

  return (
    <div className="login-scene">
      {/* ── Background decorations ── */}
      <div className="login-blob login-blob--1" />
      <div className="login-blob login-blob--2" />
      <div className="login-blob login-blob--3" />
      <div className="login-ring login-ring--1" />
      <div className="login-ring login-ring--2" />
      <div className="login-orb login-orb--1" />
      <div className="login-orb login-orb--2" />
      <div className="login-orb login-orb--3" />

      {/* ══════════════════════════════
          STEP 1 — WELCOME SCREEN
      ══════════════════════════════ */}
      {!showSplit && (
        <div className={`login-welcome${welcomeExiting ? " is-exiting" : ""}`}>
          <div className="login-welcome__icon">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <p className="login-welcome__greeting">Bienvenue</p>

          <h1 className="login-welcome__title">
            Système de Gestion
            <br />
            <span>Modules &amp; Rôles</span>
          </h1>

          <p className="login-welcome__subtitle">
            Gérez vos modules, définissez les rôles et contrôlez les accès
            depuis une interface centralisée.
          </p>

          <div className="login-welcome__progress-wrap">
            <div className="login-welcome__progress-bar" />
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          STEP 2 — SPLIT LAYOUT
      ══════════════════════════════ */}
      <div className={`login-split${showSplit ? " is-visible" : ""}`}>
        {/* ── Left info panel ── */}
        <div className="login-left">
          <div className="login-left__badge">
            <div className="login-left__badge-dot" />
            Système actif
          </div>

          <h2 className="login-left__title">
            Système de Gestion
            <br />
            <span>Modules &amp; Rôles</span>
          </h2>

          <p className="login-left__desc">
            Gérez vos modules, définissez les rôles et contrôlez les accès
            depuis une interface centralisée et sécurisée.
          </p>

          <div className="login-left__features">
            <div className="login-left__feat">
              <div className="login-left__feat-icon login-left__feat-icon--purple">
                <svg viewBox="0 0 24 24" stroke="#a78bfa">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <p className="login-left__feat-text">
                <strong>Modules dynamiques</strong> — configuration flexible
              </p>
            </div>

            <div className="login-left__feat">
              <div className="login-left__feat-icon login-left__feat-icon--pink">
                <svg viewBox="0 0 24 24" stroke="#ec4899">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="login-left__feat-text">
                <strong>Gestion des rôles</strong> — permissions granulaires
              </p>
            </div>

            <div className="login-left__feat">
              <div className="login-left__feat-icon login-left__feat-icon--teal">
                <svg viewBox="0 0 24 24" stroke="#50c8c8">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <p className="login-left__feat-text">
                <strong>Sécurité renforcée</strong> — accès contrôlés
              </p>
            </div>
          </div>
        </div>

        {/* ── Vertical divider ── */}
        <div className="login-split__divider" />

        {/* ── Right login card ── */}
        <div className="login-card">
          <div className="login-logo-wrap">
            <div className="login-logo-circle">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          <h1 className="login-title">Connexion</h1>
          <p className="login-subtitle">Connectez-vous à votre espace</p>

          <form onSubmit={handleSubmit}>
            {/* ── Username ── */}
            <div className="login-field">
              <label className="login-label" htmlFor="username">
                Nom d'utilisateur
              </label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  className="login-input"
                  id="username"
                  type="text"
                  placeholder="Entrez votre identifiant"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* ── Password ── */}
            <div className="login-field">
              <label className="login-label" htmlFor="password">
                Mot de passe
              </label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  className="login-input"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) 
                  : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )
                }
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div
                    className="toast-loading-spinner"
                    style={{ marginRight: 8 }}
                  />
                  Connexion en cours...
                </>
              ) : (
                <>
                  
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

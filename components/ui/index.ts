// Miss Lana UI primitives — the reusable, token-driven, accessible building
// blocks real pages are assembled from. Source of truth for visuals:
// docs/core/DESIGN_SYSTEM.md. See ./README.md for usage and props.

// Actions & forms
export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";
export { Field } from "./Field";
export type { FieldProps } from "./Field";

// Content
export { Card } from "./Card";
export type { CardProps, CardMeta, CardCta } from "./Card";
export { Tag } from "./Tag";
export type { TagProps, TagTone } from "./Tag";
export { MediaPlaceholder } from "./MediaPlaceholder";
export type { MediaPlaceholderProps } from "./MediaPlaceholder";
export { Accordion } from "./Accordion";
export type { AccordionProps, AccordionItem } from "./Accordion";
export { FeatureCard } from "./FeatureCard";
export type { FeatureCardProps } from "./FeatureCard";

// Navigation
export { Nav } from "./Nav";
export type { NavProps, NavLink } from "./Nav";
export { Breadcrumb } from "./Breadcrumb";
export type { BreadcrumbProps } from "./Breadcrumb";

// Layout
export { Container } from "./Container";
export type { ContainerProps } from "./Container";
export { Section } from "./Section";
export type { SectionProps } from "./Section";
export { SectionHeader } from "./SectionHeader";
export type { SectionHeaderProps } from "./SectionHeader";
export { PageHero } from "./PageHero";
export type { PageHeroProps } from "./PageHero";

// Service-line accents (§12)
export {
  ACCENT_LINE,
  ACCENT_TEXT,
  ACCENT_FILL,
  ACCENT_BORDER_TOP,
} from "./accent";
export type { Accent } from "./accent";

// SEO
export { JsonLd } from "./JsonLd";
export type { JsonLdData } from "./JsonLd";

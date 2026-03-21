import type { Profile } from "@/lib/supabase/types"

export function getVisibleProfileForViewer(
  profile: Profile,
  canViewPrivateProfile: boolean
): Profile {
  if (canViewPrivateProfile) return profile

  return {
    ...profile,
    avatar_url: null,
    bio: null,
    phone: null,
    linkedin: null,
    facebook: null,
    github: null,
    website: null,
    resume: null,
    social_links: [],
  }
}

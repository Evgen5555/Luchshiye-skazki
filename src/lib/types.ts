export type AgeGroup = "2-3" | "4-5" | "6-7" | "8-10";
export type Gender = "female" | "male" | "neutral";
export type Atmosphere =
  | "bedtime"
  | "cozy"
  | "forest"
  | "winter"
  | "magical"
  | "adventure";

export type StorySection = {
  title: string;
  text: string;
};

export type ImagePrompt = {
  scene: number;
  type: "cover" | "scene";
  prompt: string;
};

export type GeneratedStoryContent = {
  title: string;
  sections: StorySection[];
  imagePrompts: ImagePrompt[];
};

export type GeneratedImage = {
  type: "cover" | "scene";
  scene?: number;
  url: string;
  prompt: string;
};

export type SubscriptionPlanType = "NONE" | "MONTHLY" | "SINGLE_STORY";

export type UserAccess = {
  canGenerate: boolean;
  reason?: "auth_required" | "payment_required" | "trial_available" | "subscribed";
  trialUsed: boolean;
  subscriptionPlan: SubscriptionPlanType;
};

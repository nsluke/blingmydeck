export enum FilterMode {
  NONE = "none",
  NO_SERIALIZED = "no_serialized",
  PREFER_OLD_BORDER = "old_border",
  NO_FOIL = "no_foil",
  PREFER_OLDEST = "oldest",
}

export const FILTER_LABELS: Record<FilterMode, string> = {
  [FilterMode.NONE]: "No Filter",
  [FilterMode.NO_SERIALIZED]: "No Serialized Cards",
  [FilterMode.PREFER_OLD_BORDER]: "Prefer Old Border",
  [FilterMode.NO_FOIL]: "No Foil Cards",
  [FilterMode.PREFER_OLDEST]: "Prefer Oldest Printing",
};

export const FILTER_DESCRIPTIONS: Record<FilterMode, string> = {
  [FilterMode.NONE]: "Pick the most expensive printing regardless",
  [FilterMode.NO_SERIALIZED]: "Exclude serialized/unique numbered cards",
  [FilterMode.PREFER_OLD_BORDER]: "Prioritize old frame printings",
  [FilterMode.NO_FOIL]: "Only consider non-foil printings",
  [FilterMode.PREFER_OLDEST]: "Among top-priced, prefer earliest release",
};

export enum LandFilter {
  NO_GURU = "no_guru",
  ALL_DIFFERENT = "all_different",
  PREFER_FULL_ART = "prefer_full_art",
}

export const LAND_FILTER_LABELS: Record<LandFilter, string> = {
  [LandFilter.NO_GURU]: "No Guru Lands",
  [LandFilter.ALL_DIFFERENT]: "All Different Printings",
  [LandFilter.PREFER_FULL_ART]: "Prefer Full Art",
};

export const LAND_FILTER_DESCRIPTIONS: Record<LandFilter, string> = {
  [LandFilter.NO_GURU]: "Exclude expensive Guru land printings",
  [LandFilter.ALL_DIFFERENT]: "Use a different printing for each copy",
  [LandFilter.PREFER_FULL_ART]: "Prioritize full-art land printings",
};

export const BASIC_LAND_NAMES = new Set([
  "Plains",
  "Island",
  "Swamp",
  "Mountain",
  "Forest",
  "Wastes",
]);

export const TCGPLAYER_AFFILIATE_TAG = "blingoutmydeck";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Units = "km" | "mi";

interface UnitsContextType {
  units: Units;
  toggleUnits: () => void;
  setUnits: (units: Units) => void;
  convertDistance: (distanceMeters: number) => { value: number; unit: string };
  convertPace: (distanceMeters: number, durationMinutes: number) => string;
  formatDistance: (distanceMeters: number, decimals?: number) => string;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

const UNITS_STORAGE_KEY = "runnercoin_units_preference";

interface UnitsProviderProps {
  children: ReactNode;
}

export function UnitsProvider({ children }: UnitsProviderProps) {
  const [units, setUnitsState] = useState<Units>("km");

  // Load units preference from localStorage on mount
  useEffect(() => {
    const savedUnits = localStorage.getItem(UNITS_STORAGE_KEY) as Units;
    if (savedUnits && (savedUnits === "km" || savedUnits === "mi")) {
      setUnitsState(savedUnits);
    }
  }, []);

  const setUnits = (newUnits: Units) => {
    setUnitsState(newUnits);
    localStorage.setItem(UNITS_STORAGE_KEY, newUnits);
  };

  const toggleUnits = () => {
    const newUnits = units === "km" ? "mi" : "km";
    setUnits(newUnits);
  };

  // Convert distance from meters to user's preferred units
  const convertDistance = (distanceMeters: number) => {
    if (units === "mi") {
      return {
        value: distanceMeters / 1609.34,
        unit: "mi",
      };
    } else {
      return {
        value: distanceMeters / 1000,
        unit: "km",
      };
    }
  };

  // Convert pace to user's preferred units
  const convertPace = (distanceMeters: number, durationMinutes: number) => {
    const distanceKm = distanceMeters / 1000;

    if (distanceKm === 0 || durationMinutes === 0) return "--";

    const paceMinPerKm = durationMinutes / distanceKm;

    if (units === "mi") {
      const paceMinPerMile = paceMinPerKm * 1.60934;
      const paceMin = Math.floor(paceMinPerMile);
      const paceSec = Math.round((paceMinPerMile - paceMin) * 60);
      return `${paceMin}:${paceSec.toString().padStart(2, "0")}/mi`;
    } else {
      const paceMin = Math.floor(paceMinPerKm);
      const paceSec = Math.round((paceMinPerKm - paceMin) * 60);
      return `${paceMin}:${paceSec.toString().padStart(2, "0")}/km`;
    }
  };

  // Format distance with proper decimals
  const formatDistance = (distanceMeters: number, decimals: number = 2) => {
    const converted = convertDistance(distanceMeters);
    return `${converted.value.toFixed(decimals)} ${converted.unit}`;
  };

  const value: UnitsContextType = {
    units,
    toggleUnits,
    setUnits,
    convertDistance,
    convertPace,
    formatDistance,
  };

  return (
    <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>
  );
}

export function useUnits() {
  const context = useContext(UnitsContext);
  if (context === undefined) {
    throw new Error("useUnits must be used within a UnitsProvider");
  }
  return context;
}

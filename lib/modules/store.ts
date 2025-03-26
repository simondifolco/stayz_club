import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AVAILABLE_MODULES, Module, ModuleId } from "./types";

interface ModuleStore {
  modules: Module[];
  toggleModule: (moduleId: ModuleId) => void;
  getModule: (moduleId: ModuleId) => Module | undefined;
  isModuleEnabled: (moduleId: ModuleId) => boolean;
}

export const useModuleStore = create<ModuleStore>()(
  persist(
    (set, get) => ({
      modules: AVAILABLE_MODULES,
      
      toggleModule: (moduleId) => {
        set((state) => ({
          modules: state.modules.map((module) =>
            module.id === moduleId
              ? { ...module, enabled: !module.enabled }
              : module
          ),
        }));
      },

      getModule: (moduleId) => {
        return get().modules.find((module) => module.id === moduleId);
      },

      isModuleEnabled: (moduleId) => {
        const module = get().modules.find((module) => module.id === moduleId);
        return module?.enabled ?? false;
      },
    }),
    {
      name: "module-store",
    }
  )
); 
import { create } from 'zustand';

export type ActionType = 
  | 'OPEN_MODAL' 
  | 'CLOSE_MODAL'
  | 'TOGGLE_FEATURE'
  | 'CHANGE_SETTING'
  | 'TRIGGER_EFFECT';

export interface ActionParams {
  modalId?: string;
  featureId?: string;
  settingId?: string;
  value?: any;
  effectId?: string;
}

export interface Action {
  type: ActionType;
  params: ActionParams;
  handler: (params: ActionParams) => void;
}

interface ActionRegistryState {
  actions: Map<string, Action>;
  register: (action: Action) => void;
  execute: (type: ActionType, params: ActionParams) => void;
}

export const useActionRegistry = create<ActionRegistryState>((set, get) => ({
  actions: new Map(),
  
  register: (action: Action) => {
    set((state) => {
      const newActions = new Map(state.actions);
      newActions.set(action.type, action);
      return { actions: newActions };
    });
  },
  
  execute: (type: ActionType, params: ActionParams) => {
    const { actions } = get();
    const action = actions.get(type);
    if (action) {
      action.handler(params);
    }
  }
}));

// Predefined actions
export const registerDefaultActions = () => {
  const registry = useActionRegistry.getState();
  
  // Modal actions
  registry.register({
    type: 'OPEN_MODAL',
    params: {},
    handler: ({ modalId }) => {
      switch (modalId) {
        case 'specialEffects':
          document.dispatchEvent(new CustomEvent('openModal', { detail: 'specialEffects' }));
          break;
        case 'settings':
          document.dispatchEvent(new CustomEvent('openModal', { detail: 'settings' }));
          break;
        case 'apiSettings':
          document.dispatchEvent(new CustomEvent('openModal', { detail: 'apiSettings' }));
          break;
        case 'faceSelector':
          document.dispatchEvent(new CustomEvent('openModal', { detail: 'faceSelector' }));
          break;
        case 'facialRigEditor':
          document.dispatchEvent(new CustomEvent('openModal', { detail: 'facialRigEditor' }));
          break;
        case 'games':
          document.dispatchEvent(new CustomEvent('openModal', { detail: 'games' }));
          break;
        case 'projectInfo':
          document.dispatchEvent(new CustomEvent('openModal', { detail: 'projectInfo' }));
          break;
      }
    }
  });
  
  registry.register({
    type: 'CLOSE_MODAL',
    params: {},
    handler: ({ modalId }) => {
      if (modalId === 'current') {
        // Close the currently open modal
        document.dispatchEvent(new CustomEvent('closeModal'));
      } else {
        // Close a specific modal
        document.dispatchEvent(new CustomEvent('closeModal', { detail: modalId }));
      }
    }
  });
  
  // Feature toggle actions
  registry.register({
    type: 'TOGGLE_FEATURE',
    params: {},
    handler: ({ featureId, value }) => {
      switch (featureId) {
        case 'voice':
          document.dispatchEvent(new CustomEvent('toggleFeature', { detail: { feature: 'voice', value } }));
          break;
        case 'captions':
          document.dispatchEvent(new CustomEvent('toggleFeature', { detail: { feature: 'captions', value } }));
          break;
        case 'head':
          document.dispatchEvent(new CustomEvent('toggleFeature', { detail: { feature: 'head', value } }));
          break;
        case 'chat':
          document.dispatchEvent(new CustomEvent('toggleFeature', { detail: { feature: 'chat', value } }));
          break;
        case 'alwaysListen':
          document.dispatchEvent(new CustomEvent('toggleFeature', { detail: { feature: 'alwaysListen', value } }));
          break;
      }
    }
  });
  
  // Setting change actions
  registry.register({
    type: 'CHANGE_SETTING',
    params: {},
    handler: ({ settingId, value }) => {
      switch (settingId) {
        case 'animationIntensity':
          document.dispatchEvent(new CustomEvent('changeSetting', { 
            detail: { setting: 'animationIntensity', value: Math.max(0, Math.min(3, value)) }
          }));
          break;
        case 'zoomLevel':
          document.dispatchEvent(new CustomEvent('changeSetting', { 
            detail: { setting: 'zoomLevel', value: Math.max(0, Math.min(3, value)) }
          }));
          break;
        case 'voiceRate':
          document.dispatchEvent(new CustomEvent('changeSetting', { 
            detail: { setting: 'voiceRate', value: Math.max(0.5, Math.min(2, value)) }
          }));
          break;
        case 'voicePitch':
          document.dispatchEvent(new CustomEvent('changeSetting', { 
            detail: { setting: 'voicePitch', value: Math.max(0.5, Math.min(2, value)) }
          }));
          break;
        case 'voiceVolume':
          document.dispatchEvent(new CustomEvent('changeSetting', { 
            detail: { setting: 'voiceVolume', value: Math.max(0, Math.min(1, value)) }
          }));
          break;
      }
    }
  });
  
  // Effect actions
  registry.register({
    type: 'TRIGGER_EFFECT',
    params: {},
    handler: ({ effectId, value }) => {
      switch (effectId) {
        case 'pencil':
          document.dispatchEvent(new CustomEvent('triggerEffect', { 
            detail: { effect: 'pencil', value: value || { enabled: true } }
          }));
          break;
        case 'pixelate':
          document.dispatchEvent(new CustomEvent('triggerEffect', { 
            detail: { effect: 'pixelate', value: value || { enabled: true } }
          }));
          break;
        case 'scanline':
          document.dispatchEvent(new CustomEvent('triggerEffect', { 
            detail: { effect: 'scanline', value: value || { enabled: true } }
          }));
          break;
        case 'dot':
          document.dispatchEvent(new CustomEvent('triggerEffect', { 
            detail: { effect: 'dot', value: value || { enabled: true } }
          }));
          break;
      }
    }
  });
}; 
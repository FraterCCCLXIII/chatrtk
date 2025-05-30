import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { getAvailableVoices } from '@/lib/talkify-setup';

export interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (provider: string, apiKey: string, model: string, endpoint?: string) => void;
  currentProvider: string;
  currentApiKey: string;
  currentModel: string;
  currentEndpoint?: string;
  voiceSettings?: {
    rate: number;
    pitch: number;
    volume: number;
    voice: string;
  };
  onVoiceSettingsChange?: (settings: Partial<ApiKeyModalProps['voiceSettings']>) => void;
}

type ModelOption = {
  value: string;
  label: string;
};

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  open,
  onOpenChange,
  onSave,
  currentProvider = 'openai',
  currentApiKey = '',
  currentModel = '',
  currentEndpoint = '',
  voiceSettings,
  onVoiceSettingsChange,
}) => {
  const [provider, setProvider] = useState(currentProvider);
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [model, setModel] = useState(currentModel);
  const [endpoint, setEndpoint] = useState(currentEndpoint);
  const { toast } = useToast();
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available voices
  useEffect(() => {
    const voices = getAvailableVoices();
    if (voices.length > 0) {
      setAvailableVoices(voices);
    } else {
      // If voices aren't loaded yet, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        setAvailableVoices(getAvailableVoices());
      };
    }
  }, []);

  const getDefaultModel = (provider: string): string => {
    switch (provider) {
      case 'openai': return 'gpt-4o';
      case 'claude': return 'claude-3-opus-20240229';
      case 'deepseek': return 'deepseek-chat';
      case 'local': return 'local-model';
      default: return '';
    }
  };

  const modelOptions: Record<string, ModelOption[]> = {
    openai: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-4.5-preview', label: 'GPT-4.5 Preview' },
    ],
    claude: [
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
      { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
      { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
    ],
    deepseek: [
      { value: 'deepseek-chat', label: 'DeepSeek Chat' },
      { value: 'deepseek-coder', label: 'DeepSeek Coder' },
    ],
    local: [
      { value: 'local-model', label: 'Local Model (LM Studio)' },
    ],
  };

  const handleProviderChange = (value: string) => {
    setProvider(value);
    setModel(getDefaultModel(value));
  };

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key for the selected provider.",
        variant: "destructive",
      });
      return;
    }

    onSave(provider, apiKey, model, provider === 'local' ? endpoint : undefined);
    toast({
      title: "Settings Saved",
      description: `Successfully saved ${provider} API settings.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Provider Settings</DialogTitle>
          <DialogDescription>
            Configure your AI provider to power the talking head responses.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="provider" className="text-right">
              Provider
            </Label>
            <Select
              value={provider}
              onValueChange={handleProviderChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="claude">Anthropic (Claude)</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
                <SelectItem value="local">Local (LM Studio)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Model
            </Label>
            <Select
              value={model}
              onValueChange={setModel}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions[provider]?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="col-span-3"
            />
          </div>

          {provider === 'local' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endpoint" className="text-right">
                Endpoint URL
              </Label>
              <Input
                id="endpoint"
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="http://localhost:1234/v1"
                className="col-span-3"
              />
            </div>
          )}
        </div>

        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-medium">Voice Settings</h3>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="voice">Voice</Label>
              <Select
                value={voiceSettings?.voice || ''}
                onValueChange={(value) => onVoiceSettingsChange?.({ voice: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rate">Speech Rate</Label>
              <Slider
                id="rate"
                min={0.5}
                max={2}
                step={0.1}
                value={[voiceSettings?.rate || 1]}
                onValueChange={([value]) => onVoiceSettingsChange?.({ rate: value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pitch">Pitch</Label>
              <Slider
                id="pitch"
                min={0.5}
                max={2}
                step={0.1}
                value={[voiceSettings?.pitch || 1]}
                onValueChange={([value]) => onVoiceSettingsChange?.({ pitch: value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="volume">Volume</Label>
              <Slider
                id="volume"
                min={0}
                max={1}
                step={0.1}
                value={[voiceSettings?.volume || 1]}
                onValueChange={([value]) => onVoiceSettingsChange?.({ volume: value })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;

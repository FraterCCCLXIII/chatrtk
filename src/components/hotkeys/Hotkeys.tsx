import React from 'react';
import { Keyboard } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import ModalWrapper from '@/components/ui/modal-wrapper';

interface HotkeysProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Hotkeys: React.FC<HotkeysProps> = ({
  open,
  onOpenChange,
}) => {
  const { currentLanguage } = useLanguage();

  const hotkeys = [
    { key: 'h', description: getTranslation('toggleHead', currentLanguage) },
    { key: 'c', description: getTranslation('toggleChat', currentLanguage) },
    { key: 'v', description: getTranslation('toggleVoice', currentLanguage) },
    { key: 'm', description: getTranslation('toggleMicrophone', currentLanguage) },
    { key: 'a', description: getTranslation('toggleAlwaysListen', currentLanguage) },
    { key: 'f', description: getTranslation('openFaceSelector', currentLanguage) },
    { key: 'e', description: getTranslation('openFacialRigEditor', currentLanguage) },
    { key: 's', description: getTranslation('openSettings', currentLanguage) },
    { key: 'g', description: getTranslation('openGames', currentLanguage) },
    { key: 'i', description: getTranslation('openProjectInfo', currentLanguage) },
    { key: 'k', description: getTranslation('showHotkeys', currentLanguage) },
    { key: 'Esc', description: getTranslation('closeModal', currentLanguage) },
  ];

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={getTranslation('hotkeys', currentLanguage)}
      icon={<Keyboard className="h-6 w-6" />}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{getTranslation('key', currentLanguage)}</TableHead>
            <TableHead>{getTranslation('action', currentLanguage)}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotkeys.map((hotkey, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono">{hotkey.key}</TableCell>
              <TableCell>{hotkey.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ModalWrapper>
  );
};

export default Hotkeys; 
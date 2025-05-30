import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameState, GameConfig, GameAction, GameComponent } from './GameTypes';

interface BaseGameProps extends GameComponent {
  children: React.ReactNode;
}

const BaseGame: React.FC<BaseGameProps> = ({
  config,
  state,
  onAction,
  onGameEnd,
  children
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{config.name}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </CardHeader>
      <CardContent>
        {!isExpanded ? (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Click expand to play</p>
          </div>
        ) : (
          <div className="space-y-4">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BaseGame; 
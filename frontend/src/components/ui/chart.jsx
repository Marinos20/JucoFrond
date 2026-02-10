'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import * as RechartsPrimitive from 'recharts';

const THEMES = { light: '', dark: '.dark' };

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }
  return context;
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-slate-400 [&_.recharts-cartesian-grid_line]:stroke-slate-100 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-slate-200 [&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      (itemConfig.theme && itemConfig.theme[theme]) ||
      itemConfig.color;
    return color ? `--color-${key}: ${color};` : '';
  })
  .join('\n')}
}
`
          )
          .join('\n'),
      }}
    />
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

export function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  label,
  formatter,
}) {
  const { config } = useChart();

  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className={cn(
        'min-w-[12rem] rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-md p-4 shadow-2xl',
        className
      )}
    >
      {!hideLabel && (
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </div>
      )}

      <div className="grid gap-2">
        {payload.map((item, index) => {
          const key = item.dataKey;
          const itemConfig = config[key];

          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: item.color || item.fill }}
                />
                <span className="text-xs font-bold text-slate-600">
                  {itemConfig?.label || key}
                </span>
              </div>

              <span className="text-xs font-black text-slate-900 font-mono">
                {formatter
                  ? formatter(item.value, item.name, item)
                  : item.value.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

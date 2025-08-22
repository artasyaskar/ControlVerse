declare module 'react-plotly.js' {
  import * as React from 'react';

  interface PlotParams {
    data: any[];
    layout?: any;
    frames?: any[];
    config?: any;
    onInitialized?: (figure: any, graphDiv: any) => void;
    onUpdate?: (figure: any, graphDiv: any) => void;
    useResizeHandler?: boolean;
    style?: React.CSSProperties;
    className?: string;
  }

  export default class Plot extends React.Component<PlotParams> {}
}

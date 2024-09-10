import { defineStore } from "pinia";

export interface IndicatorState {
  barSize: number;
  visible: boolean;
  coordinates: {
    top: number;
    left: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  forbidden: boolean;
}

export type IndicatorStoreType = ReturnType<typeof useIndicator>;

export const useIndicator = defineStore("indicator", {
  state: () =>
    ({
      barSize: 2,
      visible: false,
      coordinates: {
        top: 0,
        left: 0,
      },
      dimensions: {
        width: 0,
        height: 0,
      },
      forbidden: false,
    } as IndicatorState),
  actions: {
    hide() {
      this.visible = false;
      this.forbidden = false;
    },
    show() {
      this.visible = true;
    },
    setIsForbidden(isForbidden) {
      this.forbidden = isForbidden;
    },
    pointBefore(element: HTMLElement) {
      this.show();

      const { top, left, height } = element.getBoundingClientRect();

      this.coordinates.top = top;
      this.coordinates.left = left;

      this.dimensions.width = this.barSize;
      this.dimensions.height = height;
    },
    pointAfter(element: HTMLElement) {
      this.show();

      const { top, left, width, height } = element.getBoundingClientRect();

      this.coordinates.top = top;
      this.coordinates.left = left + width;

      this.dimensions.width = this.barSize;
      this.dimensions.height = height;
    },
    pointInside(element: HTMLElement) {
      this.show();

      const padding = getPadding(element);
      const { top, left, width, height } = element.getBoundingClientRect();

      const paddingLeft = Number.parseInt(padding.paddingLeft);
      const paddingBottom = Number.parseInt(padding.paddingTop);
      const paddingRight = Number.parseInt(padding.paddingRight);

      this.coordinates.top = top + height - paddingBottom;
      this.coordinates.left = left + paddingLeft;

      this.dimensions.width = width - paddingLeft - paddingRight;
      this.dimensions.height = this.barSize;
    },

    pointInsideTop(element: HTMLElement) {
      this.show();

      const padding = getPadding(element);
      const { top, left, width } = element.getBoundingClientRect();
      const paddingLeft = Number.parseInt(padding.paddingLeft);
      const paddingTop = Number.parseInt(padding.paddingTop);
      const paddingRight = Number.parseInt(padding.paddingRight);

      this.coordinates.top = top + paddingTop;
      this.coordinates.left = left + paddingLeft;

      this.dimensions.width = width - paddingLeft - paddingRight;
      this.dimensions.height = this.barSize;
    },
  },
  getters: {
    isShown: (state): boolean => state.visible,
    isForbidden: (state): boolean => state.forbidden,
    position: (state): { top: number; left: number } => state.coordinates,
    size: (state): { width: number; height: number } => state.dimensions,
  },
});

function getPadding(e: HTMLElement) {
  const { paddingTop, paddingLeft, paddingRight, paddingBottom } =
    getComputedStyle(e);
  const padding = {
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingBottom,
  };

  Object.keys(padding).forEach((key) => {
    padding[key] = parseInt(padding[key].slice(0, -2), 10);
  });

  return padding;
}

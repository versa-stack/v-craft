import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useIndicator } from "../../src/store/indicator";

describe("useIndicator", () => {
  let indicator: ReturnType<typeof useIndicator>;

  beforeEach(() => {
    setActivePinia(createPinia());
    indicator = useIndicator();
  });

  describe("initial state", () => {
    it("should have default state values", () => {
      expect(indicator.barSize).toBe(2);
      expect(indicator.visible).toBe(false);
      expect(indicator.coordinates).toEqual({ top: 0, left: 0 });
      expect(indicator.dimensions).toEqual({ width: 0, height: 0 });
      expect(indicator.forbidden).toBe(false);
    });
  });

  describe("actions", () => {
    describe("hide", () => {
      it("should hide indicator and reset forbidden state", () => {
        indicator.visible = true;
        indicator.forbidden = true;

        indicator.hide();

        expect(indicator.visible).toBe(false);
        expect(indicator.forbidden).toBe(false);
      });
    });

    describe("show", () => {
      it("should show indicator", () => {
        indicator.visible = false;

        indicator.show();

        expect(indicator.visible).toBe(true);
      });
    });

    describe("setIsForbidden", () => {
      it("should set forbidden state", () => {
        indicator.setIsForbidden(true);
        expect(indicator.forbidden).toBe(true);

        indicator.setIsForbidden(false);
        expect(indicator.forbidden).toBe(false);
      });
    });

    describe("pointBefore", () => {
      it("should set indicator before element", () => {
        const el = document.createElement("div");
        Object.defineProperty(el, "getBoundingClientRect", {
          value: () => ({ top: 100, left: 200, width: 300, height: 400 }),
        });

        indicator.pointBefore(el);

        expect(indicator.visible).toBe(true);
        expect(indicator.coordinates.top).toBe(100);
        expect(indicator.coordinates.left).toBe(200);
        expect(indicator.dimensions.width).toBe(2);
        expect(indicator.dimensions.height).toBe(400);
      });
    });

    describe("pointAfter", () => {
      it("should set indicator after element", () => {
        const el = document.createElement("div");
        Object.defineProperty(el, "getBoundingClientRect", {
          value: () => ({ top: 100, left: 200, width: 300, height: 400 }),
        });

        indicator.pointAfter(el);

        expect(indicator.visible).toBe(true);
        expect(indicator.coordinates.top).toBe(100);
        expect(indicator.coordinates.left).toBe(500);
        expect(indicator.dimensions.width).toBe(2);
        expect(indicator.dimensions.height).toBe(400);
      });
    });

    describe("pointInside", () => {
      it("should set indicator inside element with padding", () => {
        const el = document.createElement("div");
        Object.defineProperty(el, "getBoundingClientRect", {
          value: () => ({ top: 100, left: 200, width: 300, height: 400 }),
        });
        Object.defineProperty(el, "style", {
          value: { paddingTop: "10px", paddingLeft: "20px", paddingRight: "30px", paddingBottom: "40px" },
        });
        Object.defineProperty(window, "getComputedStyle", {
          value: () => ({
            paddingTop: "10px",
            paddingLeft: "20px",
            paddingRight: "30px",
            paddingBottom: "40px",
          }),
        });

        indicator.pointInside(el);

        expect(indicator.visible).toBe(true);
        expect(indicator.coordinates.top).toBe(490);
        expect(indicator.coordinates.left).toBe(220);
        expect(indicator.dimensions.width).toBe(250);
        expect(indicator.dimensions.height).toBe(2);
      });
    });

    describe("pointInsideTop", () => {
      it("should set indicator at top inside element with padding", () => {
        const el = document.createElement("div");
        Object.defineProperty(el, "getBoundingClientRect", {
          value: () => ({ top: 100, left: 200, width: 300, height: 400 }),
        });
        Object.defineProperty(el, "style", {
          value: { paddingTop: "10px", paddingLeft: "20px", paddingRight: "30px", paddingBottom: "40px" },
        });
        Object.defineProperty(window, "getComputedStyle", {
          value: () => ({
            paddingTop: "10px",
            paddingLeft: "20px",
            paddingRight: "30px",
            paddingBottom: "40px",
          }),
        });

        indicator.pointInsideTop(el);

        expect(indicator.visible).toBe(true);
        expect(indicator.coordinates.top).toBe(110);
        expect(indicator.coordinates.left).toBe(220);
        expect(indicator.dimensions.width).toBe(250);
        expect(indicator.dimensions.height).toBe(2);
      });
    });
  });

  describe("getters", () => {
    describe("isShown", () => {
      it("should return visible state", () => {
        indicator.visible = true;
        expect(indicator.isShown).toBe(true);

        indicator.visible = false;
        expect(indicator.isShown).toBe(false);
      });
    });

    describe("isForbidden", () => {
      it("should return forbidden state", () => {
        indicator.forbidden = true;
        expect(indicator.isForbidden).toBe(true);

        indicator.forbidden = false;
        expect(indicator.isForbidden).toBe(false);
      });
    });

    describe("position", () => {
      it("should return coordinates", () => {
        indicator.coordinates = { top: 100, left: 200 };
        expect(indicator.position).toEqual({ top: 100, left: 200 });
      });
    });

    describe("size", () => {
      it("should return dimensions", () => {
        indicator.dimensions = { width: 300, height: 400 };
        expect(indicator.size).toEqual({ width: 300, height: 400 });
      });
    });
  });
});

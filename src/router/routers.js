import { Page, Router } from "@happysanta/router";

export const PAGE_MAIN = "/";
export const PAGE_INTRO = "/intro";

export const PANEL_MAIN = "panel_main";
export const PANEL_INTRO = "panel_intro";

export const VIEW_MAIN = "view_main";
export const VIEW_INTRO = "view_INTRO";

export const MODAL_ABOUT = "modal_about";
export const MODAL_HISTORY = "modal_history";

export const POPOUT_CONFIRM = "popout_confirm";
export const POPOUT_SPINNER = "popout_spinner";
export const POPOUT_WARNING = "popout_warning";

const routes = {
  [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
  [PAGE_INTRO]: new Page(PANEL_INTRO, VIEW_INTRO),
};

export const router = new Router(routes);

router.on("update", (nextRote, oldRoute) => {
  nextRote.getPageId(); // /product/:id([0-9]+)
  nextRote.getParams(); // { id: "12" }
  nextRote.getPanelId(); // panel_product
  nextRote.getViewId(); // view_main
  nextRote.getLocation(); // /product/12
  nextRote.isModal(); // false
  nextRote.isPopup(); // false
  nextRote.hasOverlay(); // false
});

router.start();

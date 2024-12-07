import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/auth.tsx"),
  layout("routes/dashboard/layout.tsx", [
    route("personal", "routes/dashboard/personal.tsx"),
    route("global", "routes/dashboard/global.tsx"),
  ]),
] satisfies RouteConfig;

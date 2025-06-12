perl -i -pe "s/{children}/{\n        <Providers>\n          {children}\n        <\/Providers>\n      /" src/app/layout.tsx

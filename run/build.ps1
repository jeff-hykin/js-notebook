#!/usr/bin/env sh
echo --% >/dev/null;: ' | out-null
<#'

#
# for not-Windows operating systems
#
deno run -A npm:vite build --target esnext --no-minify
exec deno run --allow-all --no-config 'https://deno.land/x/html_bundle@0.0.3.0/main/html-bundle.js' ./dist/index.html 

exit #>

#
# for windows (powershell)
#
deno run -A npm:vite build --target esnext --no-minify
exec deno run --allow-all --no-config 'https://deno.land/x/html_bundle@0.0.3.0/main/html-bundle.js' ./dist/index.html 
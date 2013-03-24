GYP_DIR=../gyp
OM=out/Release/ometa


ometa: $(OM)

.DUMMY: ometa

out/Release/ometa: v8-shell.cc ometa.gyp out/Release/build.ninja
	ninja -C out/Release ometa

out/Release/build.ninja: ometa.gyp
	../gyp/gyp --depth . ometa.gyp

clean:
	ninja -C out/Release -t clean && rm -f out/*.js

bootstrap: out/bs-js-compiler.js out/bs-ometa-compiler.js out/bs-ometa-optimizer.js out/bs-ometa-js-compiler.js

out/%.js : %.txt $(OM) Makefile bootstrap.ojs
	$(OM) bootstrap.ojs -e 'beautify("$<")' > $@

check: bootstrap
	diff bs-js-compiler.js out
	diff bs-ometa-compiler.js out
	diff bs-ometa-optimizer.js out
	diff bs-ometa-js-compiler.js out

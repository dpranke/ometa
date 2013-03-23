GYP_DIR=../gyp
OM=out/Release/ometa

ometa: $(OM)
	cp -p $(OM) .

out/Release/ometa: v8-shell.cc ometa.gyp
	ninja -C out/Release ometa

clean:
	ninja -C out/Release -t clean && rm -f out/*.js

bootstrap: out/bs-js-compiler.js out/bs-ometa-compiler.js out/bs-ometa-optimizer.js out/bs-ometa-js-compiler.js

out/%.js : %.txt $(OM)
	$(OM) bootstrap.ojs -e 'translateCode(read("$<"))' > $@

check: bootstrap
	diff bs-js-compiler.js out
	diff bs-ometa-compiler.js out
	diff bs-ometa-optimizer.js out
	diff bs-ometa-js-compiler.js out

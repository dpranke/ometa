GYP_DIR=../gyp

ometa: out/Release/ometa
	cp -p out/Release/ometa .

out/Release/ometa: v8-shell.cc ometa.gyp
	ninja -C out/Release ometa

clean:
	ninja -C out/Release -t clean && rm -f ometa

bootstrap: out/bs-js-compiler.js out/bs-ometa-compiler.js out/bs-ometa-optimizer.js out/bs-ometa-js-compiler.js

out/%.js : out/Release/ometa %.txt 
	out/Release/ometa bootstrap.ojs -e 'print(translateCode(read("$?")))' > $@

check: bootstrap
	diff bs-js-compiler.js out
	diff bs-ometa-compiler.js out
	diff bs-ometa-optimizer.js out
	diff bs-ometa-js-compiler.js out

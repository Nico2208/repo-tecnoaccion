.PHONY: patch
TMPFILE:=$(shell mktemp)
SHELL := /bin/bash
BUILD.CAPTCHA:=$(shell shuf -i100-999 -n1)
PDC=production-deployment-config.js
REFENV?=.env
BRANCH:=$(shell git branch | grep '^*' | sed 's/* //g')
VERSIONER?=npm version
PATCH?=0
MINOR?=0
MAJOR?=0

NO_TAG?=1
ifdef NO_TAG
	VERSIONER=npm version --no-git-tag-version
endif

FILES=$(wildcard src/* src/img/* src/scss/*)
FILES+=$(filter-out public/meta.json, $(wildcard public/*))
FILES+=node_modules
FILES+=generate-build-version.js package.json package-lock.json

node_modules:
	npm install

build.feoperaciones.be: .env.be $(FILES)
	cp -pf package.json $(TMPFILE)
	sed -i 's/"homepage":.*".*",/"homepage": "\/",/g' package.json
	ln -s $< .env.local
	npm run build
	rm -rf $@
	mv build $@
	rm -f .env.local
	@if [ -s $(TMPFILE) ]; then cp -pf $(TMPFILE) package.json; fi

build.feoperaciones.desa: .env.desa $(FILES)
	cp -pf package.json $(TMPFILE)
	sed -i 's/"homepage":.*".*",/"homepage": "\/feoperaciones",/g' package.json
	ln -s $< .env.local
	npm run build
	rm -rf $@
	mv build $@
	rm -f .env.local
	@if [ -s $(TMPFILE) ]; then cp -pf $(TMPFILE) package.json; fi

build.feoperaciones.production.%: .env.production.% $(FILES)
	@if [ "$(REFENV)" ]; then echo comparando $(REFENV) con $<... && diff <(sed '/^#/d' $(REFENV) | cut -f1 -d= | grep '\S' | sort) <(sed '/^#/d' $< | cut -f1 -d= | grep '\S' | sort) && echo .env Ok!; else echo no comapara .env!; fi
	@[ -e .env.production ] && (echo 'Existe el archivo .env.production, posiblemente a causa un build fallido, es necesario eliminiar este link para continuar!' && exit 1) || echo > /dev/null
	ln -s $< .env.production
	npm run build --nomaps
	rm -rf $@
	mv build $@
	rm -f .env.production

patch:
	@([ "$$(npm version --json | jq -r '.app01')" != "$$(git log --pretty='%s' -1 HEAD)" ] && \
			[ -z "$(NO_PATCH)" ]) && (if [ $(BRANCH) == dev ]; then $(VERSIONER) patch; else $(VERSIONER) --preid $(BRANCH) prerelease; fi) || echo no $@!
	@[ "$$(git status --porcelain | grep 'package.*json')" ] && git commit -am $$(npm version --json | jq -r '.app01') || true

ORG=$(shell echo $@ | rev | cut -f1 -d. | rev)

build.%: patch build.feoperaciones.%
	@echo $@ Ok!

deploy.%: build.%
	deployator deploy -e $(ORG) --game feoperaciones

RELEASE?=$(shell echo $(BRANCH) | grep -E 'R[0-9]{1}LO20[0-9]{2}')

production-version:
	@[ "$(RELEASE)" ] && ([ $(PATCH) != 0 ] && $(VERSIONER) patch || ([ $(MAJOR) != 0 ] && $(VERSIONER) major || $(VERSIONER) minor)) || echo no $@!

build.production.%: production-version build.feoperaciones.production.%
	@echo $@ Ok!

deploy.production.%: build.production.%
	@echo CUIDADO!: este deploy es para el servidor de producción, ingrese $(BUILD.CAPTCHA) para continuar.
	@read line; if [ "$$line" != "$(BUILD.CAPTCHA)" ]; then echo no deployado...; exit 1 ; fi
	deployator deploy -e $(ORG) --config $(PDC) --game feoperaciones

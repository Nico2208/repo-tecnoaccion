#!/bin/bash
#exec 3>&1 4>&2
#trap 'exec 2>&4 1>&3' 0 1 2 3
#exec 1>log.out 2>&1
UNDO_TAG=-u
NO_BACKUP_TAG=-n
FILES_LIST=.files
BACKUP_DIR_NAME=backup

usage()
{
	echo $0 '[-n <FROM> <TO>][-u <TO>]'
}

backup_dir()
{
	ssh -T $1 << EOFB 
	BACKUP_DIR=\$(dirname $2)
	[ -d \$BACKUP_DIR/$BACKUP_DIR_NAME ] && BACKUP_DIR+=/$BACKUP_DIR_NAME

	FILE=\$BACKUP_DIR/\$(date +\$(basename $2)-%Y%m%d%H%M%S).tgz
	echo resguardando instalación anterior en \$FILE ...

	if [ -e $2/$FILES_LIST ]
	then
		tar cfz \$FILE -C $2 $FILES_LIST \$(cut -f2- -d' ' $2/$FILES_LIST | sed 's/\.\///g' | tr -d '\n') | tee >(logger)
	elif [ "\$(ls -A $2)" ] 
	then
		tar cfz \$FILE -C $2 | tee >(logger)
	else
		echo instalación inexistente en $2, no se resguardaran datos anteriores 
	fi
EOFB
}

clean()
{
	ssh -T $1 << EOFC
	echo limpiando instalación vigente $2 ...
	[ -f $2/$FILES_LIST ] && \
	{ cut -f2- -d' ' $2/$FILES_LIST | sed 's/\.\///g'; } \
	| xargs -I file rm -drf $2/file | tee >(logger) || \
	ls -A1 $2 | xargs -I file rm -rf $2/file | tee >(logger)
	rm -rf $2/$FILES_LIST
EOFC
}

deploy()
{
	find $1 -type f -not -name $FILES_LIST | xargs md5sum | sed "s_$1__g" > $1/$FILES_LIST
	echo instalando la nueva versión...
	tar cz -C $1 $(cut -f2- -d' ' $1/$FILES_LIST | sed 's/\.\///g') $FILES_LIST | \
	ssh $2 "tar xz -C $3 | tee >(logger)"
}

undoing()
{
	ssh -T $1 << EOFU
	BACKUP_DIR=\$(dirname $2)
	[ -d \$BACKUP_DIR/$BACKUP_DIR_NAME ] && BACKUP_DIR+=/$BACKUP_DIR_NAME

	FILE=\$(find \$BACKUP_DIR/ -name \$(basename $2)-'*.tgz' 2> /dev/null | sort | tail -1)
	echo "restaurando la versión guardada en \$FILE..."
	tar xzf \$FILE -C $2 | tee >(logger) && rm -f \$FILE
EOFU
}

[ $1 == $NO_BACKUP_TAG ] && NO_BACKUP=1 && shift
[ $# != 2 ] && usage && exit 1
[ $1 == $UNDO_TAG ] && UNDOING=1 || FROM=$1
TO=$2

#[ -z $UNDOING ] && [ ! -d $FROM ] && echo error $FROM no es un directorio && exit 1
#[ ! -d $TO ] && echo error $TO no es un directorio && exit 1
#[ $TO == $FROM ] && echo error FROM y TO deben ser distintos - $FROM && exit 1

HOST=$(echo $FROM | cut -s -f1 -d:)
SERVER=$(echo $TO | cut -s -f1 -d:)

FROM=$(echo $FROM | cut -f2 -d:)
TO=$(echo $TO | cut -f2 -d:)

if [ $UNDOING ] 
then
	clean $SERVER $TO
	undoing $SERVER $TO
	exit $?
fi

[ -z ${NO_BACKUP+x} ] && backup_dir $SERVER $TO || echo "NO se resguardará la versión instalada actualmente!"
clean $SERVER $TO
deploy $HOST $FROM $SERVER $TO

# echo f:$FROM t:$TO u:$UNDOING h:$HOST s:$SERVER

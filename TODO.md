Hallo Martin,

ich bin nur drauf gestoßen, weil ich mit der 11 NUT in der alten IDE
programmiere und da vor meine Methoden immer das Wort public schreibe
und beim Wechsel in die neue IDE mit der 11 spät hat es nicht mehr
funktioniert. Da programmiere ich laut Lehrplan ja Algorithmen ohne OO
und meist auch ohne Klasse. Aber wenn es daran liegt, dass ich eine
Klasse erzeugen muss mache ich das. Du brauchst aus meiner Sicht nichts
machen.

In meinem Workspace i11bc-Scn-24_25 kann ich komischerweise in der neuen
IDE nichts mehr abspielen.

Und bei meiner Schülerin Christina Müller aus der i11bc-Scn_24_25 sagt
die Online IDE immer solche Sachen wie "Auf dieser Seite gibt es ein
Problem" oder "Die Seite reagiert nicht". Das ist aber nur bei ihr zu
Hause aber auf mehreren Endgeräten. Dazu fällt mir im Moment nichts ein.
Dir vielleicht?

Grüsse,
Uli



* committen: compiler geerbter konstruktor fix

* cyclic dep objectclassstringclass

* inline javascript

* decorator für javaDeclarations

exp, log in die math klasse



Fragen
======
* tostring - warum gibt die nicht einen string zurück, sondern macht magie?


async-await
===========

stmt1;
await callback(lineNo, fileNo);
stmt2;


============================================================
* nicht so sehr zustandsbehaftet
    * nimm const statt let
    * thread.currentprogramstate - sollte eher ein call auf `this.programStack[this.programStack.length - 1];`
      sein als jedes mal selbst setzen - letzteres ist fehlerträchtig


* _mj$getState$Thread_State$ - warum leakt hier LearnJ seine internen Thread States !?


* ToString widersprüchlich - gibt keinen String zurück, sondern ist println !?


* deine programmausführung is scheinbar eh sehr schnell (?)

* jede 10. taststureingabe klappt nicht

* alle 2s wird neu übersetzt, das sieht man in den dev tools !?

* tostring callback wofür ist das gut!? Wird auch im Einzelschritt nicht benutzt.

* was ist Thread.s ?

* ich finde, du denkst in zweifacher Hinsicht "außerhalb des Systems" statt innerhalb:
  * eine VM bauen mit Thread, Stack, Scheduler, ... - anstatt direkt JS zu nutzen
  * die LearnJ API mit JavaScript zu bauen anstatt mit LearnJ


* Thread.run - currentProgramState hin und herkopieren - muss das sein? Kann es anscheinend auch undefined sein?

* Semikolons können zu 99% weggelassen werden; nach if ein Leerzeichen

* JavaCompiler.startCompilingPeriodically führt ca. 4x die Funktion f aus - warum?

* WorldClass ticker und Interpreter.tick stören sich gegenseitig bzw. sind gegenseitig verdongelt - warum?

* haltAtNextBreakpoint - Aua! Besser: thread.isStepping oder so?
  MAN MUSS AUS DER ZUSTANDS-DENKE RAUS.

* angehaltene Threads - gibts eigentlich je Thread (!)

* CMPLX.PLUS(CMPLEX) - debugger hält nicht bei PLUS(!)

* Faktor 2 besser, aber ab und zu Ausreißer: 5x schlechter
* Thread & Callback Parameter unnötig
* Schritt zu einem Compiler, der JavaScript-näheren Code ausspuckt

Noch TODO:
==========
* Exceptions
* Stepping
* wait/notify
* Steps/sec





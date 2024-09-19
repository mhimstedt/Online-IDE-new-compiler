/**::
 * Boxed types
 */


Integer i1 = Integer.valueOf(12);

assertEquals(22, i1 + 10, "Add int to Integer");
assertEquals("12", i1 + "", "Integer.toString");

ArrayList<Integer> list = new ArrayList<>();
list.add(i1);
list.add(10);

assertEquals("[12, 10]", list.toString(), "add Integer and int to ArrayList<Integer>");

assertTrue(list.get(1) instanceof Integer, "Boxed int is Integer");


Double d = 12;

d++;

assertEquals(13, d, "++ -Operator doesn't work with Double value.");
assertEquals(14, ++d, "++ -Operator doesn't work with Double value.");

Integer i2 = 10;
i2--;
assertEquals(9, i2, "-- -Operator doesn't work with Double value.");
assertEquals(8, --i2, "-- -Operator doesn't work with Double value.");
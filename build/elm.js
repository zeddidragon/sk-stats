
(function() {
'use strict';

function F2(fun)
{
  function wrapper(a) { return function(b) { return fun(a,b); }; }
  wrapper.arity = 2;
  wrapper.func = fun;
  return wrapper;
}

function F3(fun)
{
  function wrapper(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  }
  wrapper.arity = 3;
  wrapper.func = fun;
  return wrapper;
}

function F4(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  }
  wrapper.arity = 4;
  wrapper.func = fun;
  return wrapper;
}

function F5(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  }
  wrapper.arity = 5;
  wrapper.func = fun;
  return wrapper;
}

function F6(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  }
  wrapper.arity = 6;
  wrapper.func = fun;
  return wrapper;
}

function F7(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  }
  wrapper.arity = 7;
  wrapper.func = fun;
  return wrapper;
}

function F8(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  }
  wrapper.arity = 8;
  wrapper.func = fun;
  return wrapper;
}

function F9(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  }
  wrapper.arity = 9;
  wrapper.func = fun;
  return wrapper;
}

function A2(fun, a, b)
{
  return fun.arity === 2
    ? fun.func(a, b)
    : fun(a)(b);
}
function A3(fun, a, b, c)
{
  return fun.arity === 3
    ? fun.func(a, b, c)
    : fun(a)(b)(c);
}
function A4(fun, a, b, c, d)
{
  return fun.arity === 4
    ? fun.func(a, b, c, d)
    : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e)
{
  return fun.arity === 5
    ? fun.func(a, b, c, d, e)
    : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f)
{
  return fun.arity === 6
    ? fun.func(a, b, c, d, e, f)
    : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g)
{
  return fun.arity === 7
    ? fun.func(a, b, c, d, e, f, g)
    : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h)
{
  return fun.arity === 8
    ? fun.func(a, b, c, d, e, f, g, h)
    : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i)
{
  return fun.arity === 9
    ? fun.func(a, b, c, d, e, f, g, h, i)
    : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

//import Native.List //

var _elm_lang$core$Native_Array = function() {

// A RRB-Tree has two distinct data types.
// Leaf -> "height"  is always 0
//         "table"   is an array of elements
// Node -> "height"  is always greater than 0
//         "table"   is an array of child nodes
//         "lengths" is an array of accumulated lengths of the child nodes

// M is the maximal table size. 32 seems fast. E is the allowed increase
// of search steps when concatting to find an index. Lower values will
// decrease balancing, but will increase search steps.
var M = 32;
var E = 2;

// An empty array.
var empty = {
	ctor: '_Array',
	height: 0,
	table: []
};


function get(i, array)
{
	if (i < 0 || i >= length(array))
	{
		throw new Error(
			'Index ' + i + ' is out of range. Check the length of ' +
			'your array first or use getMaybe or getWithDefault.');
	}
	return unsafeGet(i, array);
}


function unsafeGet(i, array)
{
	for (var x = array.height; x > 0; x--)
	{
		var slot = i >> (x * 5);
		while (array.lengths[slot] <= i)
		{
			slot++;
		}
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array = array.table[slot];
	}
	return array.table[i];
}


// Sets the value at the index i. Only the nodes leading to i will get
// copied and updated.
function set(i, item, array)
{
	if (i < 0 || length(array) <= i)
	{
		return array;
	}
	return unsafeSet(i, item, array);
}


function unsafeSet(i, item, array)
{
	array = nodeCopy(array);

	if (array.height === 0)
	{
		array.table[i] = item;
	}
	else
	{
		var slot = getSlot(i, array);
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array.table[slot] = unsafeSet(i, item, array.table[slot]);
	}
	return array;
}


function initialize(len, f)
{
	if (len <= 0)
	{
		return empty;
	}
	var h = Math.floor( Math.log(len) / Math.log(M) );
	return initialize_(f, h, 0, len);
}

function initialize_(f, h, from, to)
{
	if (h === 0)
	{
		var table = new Array((to - from) % (M + 1));
		for (var i = 0; i < table.length; i++)
		{
		  table[i] = f(from + i);
		}
		return {
			ctor: '_Array',
			height: 0,
			table: table
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

function fromList(list)
{
	if (list.ctor === '[]')
	{
		return empty;
	}

	// Allocate M sized blocks (table) and write list elements to it.
	var table = new Array(M);
	var nodes = [];
	var i = 0;

	while (list.ctor !== '[]')
	{
		table[i] = list._0;
		list = list._1;
		i++;

		// table is full, so we can push a leaf containing it into the
		// next node.
		if (i === M)
		{
			var leaf = {
				ctor: '_Array',
				height: 0,
				table: table
			};
			fromListPush(leaf, nodes);
			table = new Array(M);
			i = 0;
		}
	}

	// Maybe there is something left on the table.
	if (i > 0)
	{
		var leaf = {
			ctor: '_Array',
			height: 0,
			table: table.splice(0, i)
		};
		fromListPush(leaf, nodes);
	}

	// Go through all of the nodes and eventually push them into higher nodes.
	for (var h = 0; h < nodes.length - 1; h++)
	{
		if (nodes[h].table.length > 0)
		{
			fromListPush(nodes[h], nodes);
		}
	}

	var head = nodes[nodes.length - 1];
	if (head.height > 0 && head.table.length === 1)
	{
		return head.table[0];
	}
	else
	{
		return head;
	}
}

// Push a node into a higher node as a child.
function fromListPush(toPush, nodes)
{
	var h = toPush.height;

	// Maybe the node on this height does not exist.
	if (nodes.length === h)
	{
		var node = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
		nodes.push(node);
	}

	nodes[h].table.push(toPush);
	var len = length(toPush);
	if (nodes[h].lengths.length > 0)
	{
		len += nodes[h].lengths[nodes[h].lengths.length - 1];
	}
	nodes[h].lengths.push(len);

	if (nodes[h].table.length === M)
	{
		fromListPush(nodes[h], nodes);
		nodes[h] = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
	}
}

// Pushes an item via push_ to the bottom right of a tree.
function push(item, a)
{
	var pushed = push_(item, a);
	if (pushed !== null)
	{
		return pushed;
	}

	var newTree = create(item, a.height);
	return siblise(a, newTree);
}

// Recursively tries to push an item to the bottom-right most
// tree possible. If there is no space left for the item,
// null will be returned.
function push_(item, a)
{
	// Handle resursion stop at leaf level.
	if (a.height === 0)
	{
		if (a.table.length < M)
		{
			var newA = {
				ctor: '_Array',
				height: 0,
				table: a.table.slice()
			};
			newA.table.push(item);
			return newA;
		}
		else
		{
		  return null;
		}
	}

	// Recursively push
	var pushed = push_(item, botRight(a));

	// There was space in the bottom right tree, so the slot will
	// be updated.
	if (pushed !== null)
	{
		var newA = nodeCopy(a);
		newA.table[newA.table.length - 1] = pushed;
		newA.lengths[newA.lengths.length - 1]++;
		return newA;
	}

	// When there was no space left, check if there is space left
	// for a new slot with a tree which contains only the item
	// at the bottom.
	if (a.table.length < M)
	{
		var newSlot = create(item, a.height - 1);
		var newA = nodeCopy(a);
		newA.table.push(newSlot);
		newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
		return newA;
	}
	else
	{
		return null;
	}
}

// Converts an array into a list of elements.
function toList(a)
{
	return toList_(_elm_lang$core$Native_List.Nil, a);
}

function toList_(list, a)
{
	for (var i = a.table.length - 1; i >= 0; i--)
	{
		list =
			a.height === 0
				? _elm_lang$core$Native_List.Cons(a.table[i], list)
				: toList_(list, a.table[i]);
	}
	return list;
}

// Maps a function over the elements of an array.
function map(f, a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? f(a.table[i])
				: map(f, a.table[i]);
	}
	return newA;
}

// Maps a function over the elements with their index as first argument.
function indexedMap(f, a)
{
	return indexedMap_(f, a, 0);
}

function indexedMap_(f, a, from)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? A2(f, from + i, a.table[i])
				: indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
	}
	return newA;
}

function foldl(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = foldl(f, b, a.table[i]);
		}
	}
	return b;
}

function foldr(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = a.table.length; i--; )
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = a.table.length; i--; )
		{
			b = foldr(f, b, a.table[i]);
		}
	}
	return b;
}

// TODO: currently, it slices the right, then the left. This can be
// optimized.
function slice(from, to, a)
{
	if (from < 0)
	{
		from += length(a);
	}
	if (to < 0)
	{
		to += length(a);
	}
	return sliceLeft(from, sliceRight(to, a));
}

function sliceRight(to, a)
{
	if (to === length(a))
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(0, to);
		return newA;
	}

	// Slice the right recursively.
	var right = getSlot(to, a);
	var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (right === 0)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(0, right),
		lengths: a.lengths.slice(0, right)
	};
	if (sliced.table.length > 0)
	{
		newA.table[right] = sliced;
		newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
	}
	return newA;
}

function sliceLeft(from, a)
{
	if (from === 0)
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(from, a.table.length + 1);
		return newA;
	}

	// Slice the left recursively.
	var left = getSlot(from, a);
	var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (left === a.table.length - 1)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(left, a.table.length + 1),
		lengths: new Array(a.table.length - left)
	};
	newA.table[0] = sliced;
	var len = 0;
	for (var i = 0; i < newA.table.length; i++)
	{
		len += length(newA.table[i]);
		newA.lengths[i] = len;
	}

	return newA;
}

// Appends two trees.
function append(a,b)
{
	if (a.table.length === 0)
	{
		return b;
	}
	if (b.table.length === 0)
	{
		return a;
	}

	var c = append_(a, b);

	// Check if both nodes can be crunshed together.
	if (c[0].table.length + c[1].table.length <= M)
	{
		if (c[0].table.length === 0)
		{
			return c[1];
		}
		if (c[1].table.length === 0)
		{
			return c[0];
		}

		// Adjust .table and .lengths
		c[0].table = c[0].table.concat(c[1].table);
		if (c[0].height > 0)
		{
			var len = length(c[0]);
			for (var i = 0; i < c[1].lengths.length; i++)
			{
				c[1].lengths[i] += len;
			}
			c[0].lengths = c[0].lengths.concat(c[1].lengths);
		}

		return c[0];
	}

	if (c[0].height > 0)
	{
		var toRemove = calcToRemove(a, b);
		if (toRemove > E)
		{
			c = shuffle(c[0], c[1], toRemove);
		}
	}

	return siblise(c[0], c[1]);
}

// Returns an array of two nodes; right and left. One node _may_ be empty.
function append_(a, b)
{
	if (a.height === 0 && b.height === 0)
	{
		return [a, b];
	}

	if (a.height !== 1 || b.height !== 1)
	{
		if (a.height === b.height)
		{
			a = nodeCopy(a);
			b = nodeCopy(b);
			var appended = append_(botRight(a), botLeft(b));

			insertRight(a, appended[1]);
			insertLeft(b, appended[0]);
		}
		else if (a.height > b.height)
		{
			a = nodeCopy(a);
			var appended = append_(botRight(a), b);

			insertRight(a, appended[0]);
			b = parentise(appended[1], appended[1].height + 1);
		}
		else
		{
			b = nodeCopy(b);
			var appended = append_(a, botLeft(b));

			var left = appended[0].table.length === 0 ? 0 : 1;
			var right = left === 0 ? 1 : 0;
			insertLeft(b, appended[left]);
			a = parentise(appended[right], appended[right].height + 1);
		}
	}

	// Check if balancing is needed and return based on that.
	if (a.table.length === 0 || b.table.length === 0)
	{
		return [a, b];
	}

	var toRemove = calcToRemove(a, b);
	if (toRemove <= E)
	{
		return [a, b];
	}
	return shuffle(a, b, toRemove);
}

// Helperfunctions for append_. Replaces a child node at the side of the parent.
function insertRight(parent, node)
{
	var index = parent.table.length - 1;
	parent.table[index] = node;
	parent.lengths[index] = length(node);
	parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
}

function insertLeft(parent, node)
{
	if (node.table.length > 0)
	{
		parent.table[0] = node;
		parent.lengths[0] = length(node);

		var len = length(parent.table[0]);
		for (var i = 1; i < parent.lengths.length; i++)
		{
			len += length(parent.table[i]);
			parent.lengths[i] = len;
		}
	}
	else
	{
		parent.table.shift();
		for (var i = 1; i < parent.lengths.length; i++)
		{
			parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
		}
		parent.lengths.shift();
	}
}

// Returns the extra search steps for E. Refer to the paper.
function calcToRemove(a, b)
{
	var subLengths = 0;
	for (var i = 0; i < a.table.length; i++)
	{
		subLengths += a.table[i].table.length;
	}
	for (var i = 0; i < b.table.length; i++)
	{
		subLengths += b.table[i].table.length;
	}

	var toRemove = a.table.length + b.table.length;
	return toRemove - (Math.floor((subLengths - 1) / M) + 1);
}

// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
function get2(a, b, index)
{
	return index < a.length
		? a[index]
		: b[index - a.length];
}

function set2(a, b, index, value)
{
	if (index < a.length)
	{
		a[index] = value;
	}
	else
	{
		b[index - a.length] = value;
	}
}

function saveSlot(a, b, index, slot)
{
	set2(a.table, b.table, index, slot);

	var l = (index === 0 || index === a.lengths.length)
		? 0
		: get2(a.lengths, a.lengths, index - 1);

	set2(a.lengths, b.lengths, index, l + length(slot));
}

// Creates a node or leaf with a given length at their arrays for perfomance.
// Is only used by shuffle.
function createNode(h, length)
{
	if (length < 0)
	{
		length = 0;
	}
	var a = {
		ctor: '_Array',
		height: h,
		table: new Array(length)
	};
	if (h > 0)
	{
		a.lengths = new Array(length);
	}
	return a;
}

// Returns an array of two balanced nodes.
function shuffle(a, b, toRemove)
{
	var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
	var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

	// Skip the slots with size M. More precise: copy the slot references
	// to the new node
	var read = 0;
	while (get2(a.table, b.table, read).table.length % M === 0)
	{
		set2(newA.table, newB.table, read, get2(a.table, b.table, read));
		set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
		read++;
	}

	// Pulling items from left to right, caching in a slot before writing
	// it into the new nodes.
	var write = read;
	var slot = new createNode(a.height - 1, 0);
	var from = 0;

	// If the current slot is still containing data, then there will be at
	// least one more write, so we do not break this loop yet.
	while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
	{
		// Find out the max possible items for copying.
		var source = get2(a.table, b.table, read);
		var to = Math.min(M - slot.table.length, source.table.length);

		// Copy and adjust size table.
		slot.table = slot.table.concat(source.table.slice(from, to));
		if (slot.height > 0)
		{
			var len = slot.lengths.length;
			for (var i = len; i < len + to - from; i++)
			{
				slot.lengths[i] = length(slot.table[i]);
				slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
			}
		}

		from += to;

		// Only proceed to next slots[i] if the current one was
		// fully copied.
		if (source.table.length <= to)
		{
			read++; from = 0;
		}

		// Only create a new slot if the current one is filled up.
		if (slot.table.length === M)
		{
			saveSlot(newA, newB, write, slot);
			slot = createNode(a.height - 1, 0);
			write++;
		}
	}

	// Cleanup after the loop. Copy the last slot into the new nodes.
	if (slot.table.length > 0)
	{
		saveSlot(newA, newB, write, slot);
		write++;
	}

	// Shift the untouched slots to the left
	while (read < a.table.length + b.table.length )
	{
		saveSlot(newA, newB, write, get2(a.table, b.table, read));
		read++;
		write++;
	}

	return [newA, newB];
}

// Navigation functions
function botRight(a)
{
	return a.table[a.table.length - 1];
}
function botLeft(a)
{
	return a.table[0];
}

// Copies a node for updating. Note that you should not use this if
// only updating only one of "table" or "lengths" for performance reasons.
function nodeCopy(a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice()
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths.slice();
	}
	return newA;
}

// Returns how many items are in the tree.
function length(array)
{
	if (array.height === 0)
	{
		return array.table.length;
	}
	else
	{
		return array.lengths[array.lengths.length - 1];
	}
}

// Calculates in which slot of "table" the item probably is, then
// find the exact slot via forward searching in  "lengths". Returns the index.
function getSlot(i, a)
{
	var slot = i >> (5 * a.height);
	while (a.lengths[slot] <= i)
	{
		slot++;
	}
	return slot;
}

// Recursively creates a tree with a given height containing
// only the given item.
function create(item, h)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: [item]
		};
	}
	return {
		ctor: '_Array',
		height: h,
		table: [create(item, h - 1)],
		lengths: [1]
	};
}

// Recursively creates a tree that contains the given tree.
function parentise(tree, h)
{
	if (h === tree.height)
	{
		return tree;
	}

	return {
		ctor: '_Array',
		height: h,
		table: [parentise(tree, h - 1)],
		lengths: [length(tree)]
	};
}

// Emphasizes blood brotherhood beneath two trees.
function siblise(a, b)
{
	return {
		ctor: '_Array',
		height: a.height + 1,
		table: [a, b],
		lengths: [length(a), length(a) + length(b)]
	};
}

function toJSArray(a)
{
	var jsArray = new Array(length(a));
	toJSArray_(jsArray, 0, a);
	return jsArray;
}

function toJSArray_(jsArray, i, a)
{
	for (var t = 0; t < a.table.length; t++)
	{
		if (a.height === 0)
		{
			jsArray[i + t] = a.table[t];
		}
		else
		{
			var inc = t === 0 ? 0 : a.lengths[t - 1];
			toJSArray_(jsArray, i + inc, a.table[t]);
		}
	}
}

function fromJSArray(jsArray)
{
	if (jsArray.length === 0)
	{
		return empty;
	}
	var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
	return fromJSArray_(jsArray, h, 0, jsArray.length);
}

function fromJSArray_(jsArray, h, from, to)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: jsArray.slice(from, to)
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

return {
	empty: empty,
	fromList: fromList,
	toList: toList,
	initialize: F2(initialize),
	append: F2(append),
	push: F2(push),
	slice: F3(slice),
	get: F2(get),
	set: F3(set),
	map: F2(map),
	indexedMap: F2(indexedMap),
	foldl: F3(foldl),
	foldr: F3(foldr),
	length: length,

	toJSArray: toJSArray,
	fromJSArray: fromJSArray
};

}();
//import Native.Utils //

var _elm_lang$core$Native_Basics = function() {

function div(a, b)
{
	return (a / b) | 0;
}
function rem(a, b)
{
	return a % b;
}
function mod(a, b)
{
	if (b === 0)
	{
		throw new Error('Cannot perform mod 0. Division by zero error.');
	}
	var r = a % b;
	var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r + b) : -mod(-a, -b));

	return m === b ? 0 : m;
}
function logBase(base, n)
{
	return Math.log(n) / Math.log(base);
}
function negate(n)
{
	return -n;
}
function abs(n)
{
	return n < 0 ? -n : n;
}

function min(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
}
function max(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
}
function clamp(lo, hi, n)
{
	return _elm_lang$core$Native_Utils.cmp(n, lo) < 0
		? lo
		: _elm_lang$core$Native_Utils.cmp(n, hi) > 0
			? hi
			: n;
}

var ord = ['LT', 'EQ', 'GT'];

function compare(x, y)
{
	return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
}

function xor(a, b)
{
	return a !== b;
}
function not(b)
{
	return !b;
}
function isInfinite(n)
{
	return n === Infinity || n === -Infinity;
}

function truncate(n)
{
	return n | 0;
}

function degrees(d)
{
	return d * Math.PI / 180;
}
function turns(t)
{
	return 2 * Math.PI * t;
}
function fromPolar(point)
{
	var r = point._0;
	var t = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
}
function toPolar(point)
{
	var x = point._0;
	var y = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
}

return {
	div: F2(div),
	rem: F2(rem),
	mod: F2(mod),

	pi: Math.PI,
	e: Math.E,
	cos: Math.cos,
	sin: Math.sin,
	tan: Math.tan,
	acos: Math.acos,
	asin: Math.asin,
	atan: Math.atan,
	atan2: F2(Math.atan2),

	degrees: degrees,
	turns: turns,
	fromPolar: fromPolar,
	toPolar: toPolar,

	sqrt: Math.sqrt,
	logBase: F2(logBase),
	negate: negate,
	abs: abs,
	min: F2(min),
	max: F2(max),
	clamp: F3(clamp),
	compare: F2(compare),

	xor: F2(xor),
	not: not,

	truncate: truncate,
	ceiling: Math.ceil,
	floor: Math.floor,
	round: Math.round,
	toFloat: function(x) { return x; },
	isNaN: isNaN,
	isInfinite: isInfinite
};

}();
//import //

var _elm_lang$core$Native_Utils = function() {

// COMPARISONS

function eq(x, y)
{
	var stack = [];
	var isEqual = eqHelp(x, y, 0, stack);
	var pair;
	while (isEqual && (pair = stack.pop()))
	{
		isEqual = eqHelp(pair.x, pair.y, 0, stack);
	}
	return isEqual;
}


function eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push({ x: x, y: y });
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object')
	{
		if (typeof x === 'function')
		{
			throw new Error(
				'Trying to use `(==)` on functions. There is no way to know if functions are "the same" in the Elm sense.'
				+ ' Read more about this at http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#=='
				+ ' which describes why it is this way and what the better version will look like.'
			);
		}
		return false;
	}

	if (x === null || y === null)
	{
		return false
	}

	if (x instanceof Date)
	{
		return x.getTime() === y.getTime();
	}

	if (!('ctor' in x))
	{
		for (var key in x)
		{
			if (!eqHelp(x[key], y[key], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	// convert Dicts and Sets to lists
	if (x.ctor === 'RBNode_elm_builtin' || x.ctor === 'RBEmpty_elm_builtin')
	{
		x = _elm_lang$core$Dict$toList(x);
		y = _elm_lang$core$Dict$toList(y);
	}
	if (x.ctor === 'Set_elm_builtin')
	{
		x = _elm_lang$core$Set$toList(x);
		y = _elm_lang$core$Set$toList(y);
	}

	// check if lists are equal without recursion
	if (x.ctor === '::')
	{
		var a = x;
		var b = y;
		while (a.ctor === '::' && b.ctor === '::')
		{
			if (!eqHelp(a._0, b._0, depth + 1, stack))
			{
				return false;
			}
			a = a._1;
			b = b._1;
		}
		return a.ctor === b.ctor;
	}

	// check if Arrays are equal
	if (x.ctor === '_Array')
	{
		var xs = _elm_lang$core$Native_Array.toJSArray(x);
		var ys = _elm_lang$core$Native_Array.toJSArray(y);
		if (xs.length !== ys.length)
		{
			return false;
		}
		for (var i = 0; i < xs.length; i++)
		{
			if (!eqHelp(xs[i], ys[i], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	if (!eqHelp(x.ctor, y.ctor, depth + 1, stack))
	{
		return false;
	}

	for (var key in x)
	{
		if (!eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

var LT = -1, EQ = 0, GT = 1;

function cmp(x, y)
{
	if (typeof x !== 'object')
	{
		return x === y ? EQ : x < y ? LT : GT;
	}

	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? EQ : a < b ? LT : GT;
	}

	if (x.ctor === '::' || x.ctor === '[]')
	{
		while (x.ctor === '::' && y.ctor === '::')
		{
			var ord = cmp(x._0, y._0);
			if (ord !== EQ)
			{
				return ord;
			}
			x = x._1;
			y = y._1;
		}
		return x.ctor === y.ctor ? EQ : x.ctor === '[]' ? LT : GT;
	}

	if (x.ctor.slice(0, 6) === '_Tuple')
	{
		var ord;
		var n = x.ctor.slice(6) - 0;
		var err = 'cannot compare tuples with more than 6 elements.';
		if (n === 0) return EQ;
		if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
		if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
		if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
		if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
		if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
		if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
		if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
		return EQ;
	}

	throw new Error(
		'Comparison error: comparison is only defined on ints, '
		+ 'floats, times, chars, strings, lists of comparable values, '
		+ 'and tuples of comparable values.'
	);
}


// COMMON VALUES

var Tuple0 = {
	ctor: '_Tuple0'
};

function Tuple2(x, y)
{
	return {
		ctor: '_Tuple2',
		_0: x,
		_1: y
	};
}

function chr(c)
{
	return new String(c);
}


// GUID

var count = 0;
function guid(_)
{
	return count++;
}


// RECORDS

function update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


//// LIST STUFF ////

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return {
		ctor: '::',
		_0: hd,
		_1: tl
	};
}

function append(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (xs.ctor === '[]')
	{
		return ys;
	}
	var root = Cons(xs._0, Nil);
	var curr = root;
	xs = xs._1;
	while (xs.ctor !== '[]')
	{
		curr._1 = Cons(xs._0, Nil);
		xs = xs._1;
		curr = curr._1;
	}
	curr._1 = ys;
	return root;
}


// CRASHES

function crash(moduleName, region)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function crashCase(moduleName, region, value)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '`\n\n'
			+ 'This was caused by the `case` expression ' + regionToString(region) + '.\n'
			+ 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function regionToString(region)
{
	if (region.start.line == region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'between lines ' + region.start.line + ' and ' + region.end.line;
}


// TO STRING

function toString(v)
{
	var type = typeof v;
	if (type === 'function')
	{
		return '<function>';
	}

	if (type === 'boolean')
	{
		return v ? 'True' : 'False';
	}

	if (type === 'number')
	{
		return v + '';
	}

	if (v instanceof String)
	{
		return '\'' + addSlashes(v, true) + '\'';
	}

	if (type === 'string')
	{
		return '"' + addSlashes(v, false) + '"';
	}

	if (v === null)
	{
		return 'null';
	}

	if (type === 'object' && 'ctor' in v)
	{
		var ctorStarter = v.ctor.substring(0, 5);

		if (ctorStarter === '_Tupl')
		{
			var output = [];
			for (var k in v)
			{
				if (k === 'ctor') continue;
				output.push(toString(v[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (ctorStarter === '_Task')
		{
			return '<task>'
		}

		if (v.ctor === '_Array')
		{
			var list = _elm_lang$core$Array$toList(v);
			return 'Array.fromList ' + toString(list);
		}

		if (v.ctor === '<decoder>')
		{
			return '<decoder>';
		}

		if (v.ctor === '_Process')
		{
			return '<process:' + v.id + '>';
		}

		if (v.ctor === '::')
		{
			var output = '[' + toString(v._0);
			v = v._1;
			while (v.ctor === '::')
			{
				output += ',' + toString(v._0);
				v = v._1;
			}
			return output + ']';
		}

		if (v.ctor === '[]')
		{
			return '[]';
		}

		if (v.ctor === 'Set_elm_builtin')
		{
			return 'Set.fromList ' + toString(_elm_lang$core$Set$toList(v));
		}

		if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin')
		{
			return 'Dict.fromList ' + toString(_elm_lang$core$Dict$toList(v));
		}

		var output = '';
		for (var i in v)
		{
			if (i === 'ctor') continue;
			var str = toString(v[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return v.ctor + output;
	}

	if (type === 'object')
	{
		if (v instanceof Date)
		{
			return '<' + v.toString() + '>';
		}

		if (v.elm_web_socket)
		{
			return '<websocket>';
		}

		var output = [];
		for (var k in v)
		{
			output.push(k + ' = ' + toString(v[k]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return '<internal structure>';
}

function addSlashes(str, isChar)
{
	var s = str.replace(/\\/g, '\\\\')
			  .replace(/\n/g, '\\n')
			  .replace(/\t/g, '\\t')
			  .replace(/\r/g, '\\r')
			  .replace(/\v/g, '\\v')
			  .replace(/\0/g, '\\0');
	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}


return {
	eq: eq,
	cmp: cmp,
	Tuple0: Tuple0,
	Tuple2: Tuple2,
	chr: chr,
	update: update,
	guid: guid,

	append: F2(append),

	crash: crash,
	crashCase: crashCase,

	toString: toString
};

}();
var _elm_lang$core$Basics$never = function (_p0) {
	never:
	while (true) {
		var _p1 = _p0;
		var _v1 = _p1._0;
		_p0 = _v1;
		continue never;
	}
};
var _elm_lang$core$Basics$uncurry = F2(
	function (f, _p2) {
		var _p3 = _p2;
		return A2(f, _p3._0, _p3._1);
	});
var _elm_lang$core$Basics$curry = F3(
	function (f, a, b) {
		return f(
			{ctor: '_Tuple2', _0: a, _1: b});
	});
var _elm_lang$core$Basics$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var _elm_lang$core$Basics$always = F2(
	function (a, _p4) {
		return a;
	});
var _elm_lang$core$Basics$identity = function (x) {
	return x;
};
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<|'] = F2(
	function (f, x) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['|>'] = F2(
	function (x, f) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>>'] = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<<'] = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
var _elm_lang$core$Basics$radians = function (t) {
	return t;
};
var _elm_lang$core$Basics$GT = {ctor: 'GT'};
var _elm_lang$core$Basics$EQ = {ctor: 'EQ'};
var _elm_lang$core$Basics$LT = {ctor: 'LT'};
var _elm_lang$core$Basics$JustOneMore = function (a) {
	return {ctor: 'JustOneMore', _0: a};
};

var _elm_lang$core$Maybe$withDefault = F2(
	function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
var _elm_lang$core$Maybe$Nothing = {ctor: 'Nothing'};
var _elm_lang$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		var _p1 = maybeValue;
		if (_p1.ctor === 'Just') {
			return callback(_p1._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$Just = function (a) {
	return {ctor: 'Just', _0: a};
};
var _elm_lang$core$Maybe$map = F2(
	function (f, maybe) {
		var _p2 = maybe;
		if (_p2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(
				f(_p2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		var _p3 = {ctor: '_Tuple2', _0: ma, _1: mb};
		if (((_p3.ctor === '_Tuple2') && (_p3._0.ctor === 'Just')) && (_p3._1.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A2(func, _p3._0._0, _p3._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		var _p4 = {ctor: '_Tuple3', _0: ma, _1: mb, _2: mc};
		if ((((_p4.ctor === '_Tuple3') && (_p4._0.ctor === 'Just')) && (_p4._1.ctor === 'Just')) && (_p4._2.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A3(func, _p4._0._0, _p4._1._0, _p4._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		var _p5 = {ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md};
		if (((((_p5.ctor === '_Tuple4') && (_p5._0.ctor === 'Just')) && (_p5._1.ctor === 'Just')) && (_p5._2.ctor === 'Just')) && (_p5._3.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A4(func, _p5._0._0, _p5._1._0, _p5._2._0, _p5._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map5 = F6(
	function (func, ma, mb, mc, md, me) {
		var _p6 = {ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me};
		if ((((((_p6.ctor === '_Tuple5') && (_p6._0.ctor === 'Just')) && (_p6._1.ctor === 'Just')) && (_p6._2.ctor === 'Just')) && (_p6._3.ctor === 'Just')) && (_p6._4.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A5(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0, _p6._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_List = function() {

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return { ctor: '::', _0: hd, _1: tl };
}

function fromArray(arr)
{
	var out = Nil;
	for (var i = arr.length; i--; )
	{
		out = Cons(arr[i], out);
	}
	return out;
}

function toArray(xs)
{
	var out = [];
	while (xs.ctor !== '[]')
	{
		out.push(xs._0);
		xs = xs._1;
	}
	return out;
}

function foldr(f, b, xs)
{
	var arr = toArray(xs);
	var acc = b;
	for (var i = arr.length; i--; )
	{
		acc = A2(f, arr[i], acc);
	}
	return acc;
}

function map2(f, xs, ys)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]')
	{
		arr.push(A2(f, xs._0, ys._0));
		xs = xs._1;
		ys = ys._1;
	}
	return fromArray(arr);
}

function map3(f, xs, ys, zs)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
	{
		arr.push(A3(f, xs._0, ys._0, zs._0));
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map4(f, ws, xs, ys, zs)
{
	var arr = [];
	while (   ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map5(f, vs, ws, xs, ys, zs)
{
	var arr = [];
	while (   vs.ctor !== '[]'
		   && ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
		vs = vs._1;
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function sortBy(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
	}));
}

function sortWith(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		var ord = f(a)(b).ctor;
		return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
	}));
}

return {
	Nil: Nil,
	Cons: Cons,
	cons: F2(Cons),
	toArray: toArray,
	fromArray: fromArray,

	foldr: F3(foldr),

	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	sortBy: F2(sortBy),
	sortWith: F2(sortWith)
};

}();
var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
var _elm_lang$core$List$sort = function (xs) {
	return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
};
var _elm_lang$core$List$singleton = function (value) {
	return {
		ctor: '::',
		_0: value,
		_1: {ctor: '[]'}
	};
};
var _elm_lang$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
						_v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
var _elm_lang$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
						_v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
var _elm_lang$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			_elm_lang$core$List$any,
			function (_p2) {
				return !isOkay(_p2);
			},
			list);
	});
var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
var _elm_lang$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
					_v8 = A2(func, _p3._0, acc),
					_v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
var _elm_lang$core$List$length = function (xs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p4, i) {
				return i + 1;
			}),
		0,
		xs);
};
var _elm_lang$core$List$sum = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x + y;
			}),
		0,
		numbers);
};
var _elm_lang$core$List$product = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x * y;
			}),
		1,
		numbers);
};
var _elm_lang$core$List$maximum = function (list) {
	var _p5 = list;
	if (_p5.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$minimum = function (list) {
	var _p6 = list;
	if (_p6.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$member = F2(
	function (x, xs) {
		return A2(
			_elm_lang$core$List$any,
			function (a) {
				return _elm_lang$core$Native_Utils.eq(a, x);
			},
			xs);
	});
var _elm_lang$core$List$isEmpty = function (xs) {
	var _p7 = xs;
	if (_p7.ctor === '[]') {
		return true;
	} else {
		return false;
	}
};
var _elm_lang$core$List$tail = function (list) {
	var _p8 = list;
	if (_p8.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p8._1);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$head = function (list) {
	var _p9 = list;
	if (_p9.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p9._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
var _elm_lang$core$List$map = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, acc) {
					return {
						ctor: '::',
						_0: f(x),
						_1: acc
					};
				}),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$filter = F2(
	function (pred, xs) {
		var conditionalCons = F2(
			function (front, back) {
				return pred(front) ? {ctor: '::', _0: front, _1: back} : back;
			});
		return A3(
			_elm_lang$core$List$foldr,
			conditionalCons,
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return {ctor: '::', _0: _p10._0, _1: xs};
		} else {
			return xs;
		}
	});
var _elm_lang$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			_elm_lang$core$List$maybeCons(f),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$reverse = function (list) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return {ctor: '::', _0: x, _1: y};
			}),
		{ctor: '[]'},
		list);
};
var _elm_lang$core$List$scanl = F3(
	function (f, b, xs) {
		var scan1 = F2(
			function (x, accAcc) {
				var _p11 = accAcc;
				if (_p11.ctor === '::') {
					return {
						ctor: '::',
						_0: A2(f, x, _p11._0),
						_1: accAcc
					};
				} else {
					return {ctor: '[]'};
				}
			});
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$foldl,
				scan1,
				{
					ctor: '::',
					_0: b,
					_1: {ctor: '[]'}
				},
				xs));
	});
var _elm_lang$core$List$append = F2(
	function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					}),
				ys,
				xs);
		}
	});
var _elm_lang$core$List$concat = function (lists) {
	return A3(
		_elm_lang$core$List$foldr,
		_elm_lang$core$List$append,
		{ctor: '[]'},
		lists);
};
var _elm_lang$core$List$concatMap = F2(
	function (f, list) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$map, f, list));
	});
var _elm_lang$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _p13) {
				var _p14 = _p13;
				var _p16 = _p14._0;
				var _p15 = _p14._1;
				return pred(x) ? {
					ctor: '_Tuple2',
					_0: {ctor: '::', _0: x, _1: _p16},
					_1: _p15
				} : {
					ctor: '_Tuple2',
					_0: _p16,
					_1: {ctor: '::', _0: x, _1: _p15}
				};
			});
		return A3(
			_elm_lang$core$List$foldr,
			step,
			{
				ctor: '_Tuple2',
				_0: {ctor: '[]'},
				_1: {ctor: '[]'}
			},
			list);
	});
var _elm_lang$core$List$unzip = function (pairs) {
	var step = F2(
		function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: {ctor: '::', _0: _p19._0, _1: _p20._0},
				_1: {ctor: '::', _0: _p19._1, _1: _p20._1}
			};
		});
	return A3(
		_elm_lang$core$List$foldr,
		step,
		{
			ctor: '_Tuple2',
			_0: {ctor: '[]'},
			_1: {ctor: '[]'}
		},
		pairs);
};
var _elm_lang$core$List$intersperse = F2(
	function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var step = F2(
				function (x, rest) {
					return {
						ctor: '::',
						_0: sep,
						_1: {ctor: '::', _0: x, _1: rest}
					};
				});
			var spersed = A3(
				_elm_lang$core$List$foldr,
				step,
				{ctor: '[]'},
				_p21._1);
			return {ctor: '::', _0: _p21._0, _1: spersed};
		}
	});
var _elm_lang$core$List$takeReverse = F3(
	function (n, list, taken) {
		takeReverse:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return taken;
			} else {
				var _p22 = list;
				if (_p22.ctor === '[]') {
					return taken;
				} else {
					var _v23 = n - 1,
						_v24 = _p22._1,
						_v25 = {ctor: '::', _0: _p22._0, _1: taken};
					n = _v23;
					list = _v24;
					taken = _v25;
					continue takeReverse;
				}
			}
		}
	});
var _elm_lang$core$List$takeTailRec = F2(
	function (n, list) {
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$takeReverse,
				n,
				list,
				{ctor: '[]'}));
	});
var _elm_lang$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return {ctor: '[]'};
		} else {
			var _p23 = {ctor: '_Tuple2', _0: n, _1: list};
			_v26_5:
			do {
				_v26_1:
				do {
					if (_p23.ctor === '_Tuple2') {
						if (_p23._1.ctor === '[]') {
							return list;
						} else {
							if (_p23._1._1.ctor === '::') {
								switch (_p23._0) {
									case 1:
										break _v26_1;
									case 2:
										return {
											ctor: '::',
											_0: _p23._1._0,
											_1: {
												ctor: '::',
												_0: _p23._1._1._0,
												_1: {ctor: '[]'}
											}
										};
									case 3:
										if (_p23._1._1._1.ctor === '::') {
											return {
												ctor: '::',
												_0: _p23._1._0,
												_1: {
													ctor: '::',
													_0: _p23._1._1._0,
													_1: {
														ctor: '::',
														_0: _p23._1._1._1._0,
														_1: {ctor: '[]'}
													}
												}
											};
										} else {
											break _v26_5;
										}
									default:
										if ((_p23._1._1._1.ctor === '::') && (_p23._1._1._1._1.ctor === '::')) {
											var _p28 = _p23._1._1._1._0;
											var _p27 = _p23._1._1._0;
											var _p26 = _p23._1._0;
											var _p25 = _p23._1._1._1._1._0;
											var _p24 = _p23._1._1._1._1._1;
											return (_elm_lang$core$Native_Utils.cmp(ctr, 1000) > 0) ? {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A2(_elm_lang$core$List$takeTailRec, n - 4, _p24)
														}
													}
												}
											} : {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A3(_elm_lang$core$List$takeFast, ctr + 1, n - 4, _p24)
														}
													}
												}
											};
										} else {
											break _v26_5;
										}
								}
							} else {
								if (_p23._0 === 1) {
									break _v26_1;
								} else {
									break _v26_5;
								}
							}
						}
					} else {
						break _v26_5;
					}
				} while(false);
				return {
					ctor: '::',
					_0: _p23._1._0,
					_1: {ctor: '[]'}
				};
			} while(false);
			return list;
		}
	});
var _elm_lang$core$List$take = F2(
	function (n, list) {
		return A3(_elm_lang$core$List$takeFast, 0, n, list);
	});
var _elm_lang$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v27 = {ctor: '::', _0: value, _1: result},
					_v28 = n - 1,
					_v29 = value;
				result = _v27;
				n = _v28;
				value = _v29;
				continue repeatHelp;
			}
		}
	});
var _elm_lang$core$List$repeat = F2(
	function (n, value) {
		return A3(
			_elm_lang$core$List$repeatHelp,
			{ctor: '[]'},
			n,
			value);
	});
var _elm_lang$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(lo, hi) < 1) {
				var _v30 = lo,
					_v31 = hi - 1,
					_v32 = {ctor: '::', _0: hi, _1: list};
				lo = _v30;
				hi = _v31;
				list = _v32;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var _elm_lang$core$List$range = F2(
	function (lo, hi) {
		return A3(
			_elm_lang$core$List$rangeHelp,
			lo,
			hi,
			{ctor: '[]'});
	});
var _elm_lang$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$map2,
			f,
			A2(
				_elm_lang$core$List$range,
				0,
				_elm_lang$core$List$length(xs) - 1),
			xs);
	});

var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
var _elm_lang$core$Array$isEmpty = function (array) {
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Array$length(array),
		0);
};
var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
var _elm_lang$core$Array$get = F2(
	function (i, array) {
		return ((_elm_lang$core$Native_Utils.cmp(0, i) < 1) && (_elm_lang$core$Native_Utils.cmp(
			i,
			_elm_lang$core$Native_Array.length(array)) < 0)) ? _elm_lang$core$Maybe$Just(
			A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
var _elm_lang$core$Array$filter = F2(
	function (isOkay, arr) {
		var update = F2(
			function (x, xs) {
				return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
			});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
var _elm_lang$core$Array$toIndexedList = function (array) {
	return A3(
		_elm_lang$core$List$map2,
		F2(
			function (v0, v1) {
				return {ctor: '_Tuple2', _0: v0, _1: v1};
			}),
		A2(
			_elm_lang$core$List$range,
			0,
			_elm_lang$core$Native_Array.length(array) - 1),
		_elm_lang$core$Native_Array.toList(array));
};
var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
var _elm_lang$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			_elm_lang$core$Array$initialize,
			n,
			_elm_lang$core$Basics$always(e));
	});
var _elm_lang$core$Array$Array = {ctor: 'Array'};

//import Native.Utils //

var _elm_lang$core$Native_Char = function() {

return {
	fromCode: function(c) { return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c)); },
	toCode: function(c) { return c.charCodeAt(0); },
	toUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toUpperCase()); },
	toLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLowerCase()); },
	toLocaleUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase()); },
	toLocaleLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase()); }
};

}();
var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
var _elm_lang$core$Char$isBetween = F3(
	function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(low)) > -1) && (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(high)) < 1);
	});
var _elm_lang$core$Char$isUpper = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('A'),
	_elm_lang$core$Native_Utils.chr('Z'));
var _elm_lang$core$Char$isLower = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('a'),
	_elm_lang$core$Native_Utils.chr('z'));
var _elm_lang$core$Char$isDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('9'));
var _elm_lang$core$Char$isOctDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('7'));
var _elm_lang$core$Char$isHexDigit = function ($char) {
	return _elm_lang$core$Char$isDigit($char) || (A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('a'),
		_elm_lang$core$Native_Utils.chr('f'),
		$char) || A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('A'),
		_elm_lang$core$Native_Utils.chr('F'),
		$char));
};

//import Native.Utils //

var _elm_lang$core$Native_Scheduler = function() {

var MAX_STEPS = 10000;


// TASKS

function succeed(value)
{
	return {
		ctor: '_Task_succeed',
		value: value
	};
}

function fail(error)
{
	return {
		ctor: '_Task_fail',
		value: error
	};
}

function nativeBinding(callback)
{
	return {
		ctor: '_Task_nativeBinding',
		callback: callback,
		cancel: null
	};
}

function andThen(callback, task)
{
	return {
		ctor: '_Task_andThen',
		callback: callback,
		task: task
	};
}

function onError(callback, task)
{
	return {
		ctor: '_Task_onError',
		callback: callback,
		task: task
	};
}

function receive(callback)
{
	return {
		ctor: '_Task_receive',
		callback: callback
	};
}


// PROCESSES

function rawSpawn(task)
{
	var process = {
		ctor: '_Process',
		id: _elm_lang$core$Native_Utils.guid(),
		root: task,
		stack: null,
		mailbox: []
	};

	enqueue(process);

	return process;
}

function spawn(task)
{
	return nativeBinding(function(callback) {
		var process = rawSpawn(task);
		callback(succeed(process));
	});
}

function rawSend(process, msg)
{
	process.mailbox.push(msg);
	enqueue(process);
}

function send(process, msg)
{
	return nativeBinding(function(callback) {
		rawSend(process, msg);
		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function kill(process)
{
	return nativeBinding(function(callback) {
		var root = process.root;
		if (root.ctor === '_Task_nativeBinding' && root.cancel)
		{
			root.cancel();
		}

		process.root = null;

		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sleep(time)
{
	return nativeBinding(function(callback) {
		var id = setTimeout(function() {
			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}


// STEP PROCESSES

function step(numSteps, process)
{
	while (numSteps < MAX_STEPS)
	{
		var ctor = process.root.ctor;

		if (ctor === '_Task_succeed')
		{
			while (process.stack && process.stack.ctor === '_Task_onError')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_fail')
		{
			while (process.stack && process.stack.ctor === '_Task_andThen')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_andThen')
		{
			process.stack = {
				ctor: '_Task_andThen',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_onError')
		{
			process.stack = {
				ctor: '_Task_onError',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_nativeBinding')
		{
			process.root.cancel = process.root.callback(function(newRoot) {
				process.root = newRoot;
				enqueue(process);
			});

			break;
		}

		if (ctor === '_Task_receive')
		{
			var mailbox = process.mailbox;
			if (mailbox.length === 0)
			{
				break;
			}

			process.root = process.root.callback(mailbox.shift());
			++numSteps;
			continue;
		}

		throw new Error(ctor);
	}

	if (numSteps < MAX_STEPS)
	{
		return numSteps + 1;
	}
	enqueue(process);

	return numSteps;
}


// WORK QUEUE

var working = false;
var workQueue = [];

function enqueue(process)
{
	workQueue.push(process);

	if (!working)
	{
		setTimeout(work, 0);
		working = true;
	}
}

function work()
{
	var numSteps = 0;
	var process;
	while (numSteps < MAX_STEPS && (process = workQueue.shift()))
	{
		if (process.root)
		{
			numSteps = step(numSteps, process);
		}
	}
	if (!process)
	{
		working = false;
		return;
	}
	setTimeout(work, 0);
}


return {
	succeed: succeed,
	fail: fail,
	nativeBinding: nativeBinding,
	andThen: F2(andThen),
	onError: F2(onError),
	receive: receive,

	spawn: spawn,
	kill: kill,
	sleep: sleep,
	send: F2(send),

	rawSpawn: rawSpawn,
	rawSend: rawSend
};

}();
//import //

var _elm_lang$core$Native_Platform = function() {


// PROGRAMS

function program(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flags !== 'undefined')
				{
					throw new Error(
						'The `' + moduleName + '` module does not need flags.\n'
						+ 'Call ' + moduleName + '.worker() with no arguments and you should be all set!'
					);
				}

				return initialize(
					impl.init,
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function programWithFlags(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flagDecoder === 'undefined')
				{
					throw new Error(
						'Are you trying to sneak a Never value into Elm? Trickster!\n'
						+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
						+ 'Use `program` instead if you do not want flags.'
					);
				}

				var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
				if (result.ctor === 'Err')
				{
					throw new Error(
						moduleName + '.worker(...) was called with an unexpected argument.\n'
						+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
						+ result._0
					);
				}

				return initialize(
					impl.init(result._0),
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function renderer(enqueue, _)
{
	return function(_) {};
}


// HTML TO PROGRAM

function htmlToProgram(vnode)
{
	var emptyBag = batch(_elm_lang$core$Native_List.Nil);
	var noChange = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		emptyBag
	);

	return _elm_lang$virtual_dom$VirtualDom$program({
		init: noChange,
		view: function(model) { return main; },
		update: F2(function(msg, model) { return noChange; }),
		subscriptions: function (model) { return emptyBag; }
	});
}


// INITIALIZE A PROGRAM

function initialize(init, update, subscriptions, renderer)
{
	// ambient state
	var managers = {};
	var updateView;

	// init and update state in main process
	var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		var model = init._0;
		updateView = renderer(enqueue, model);
		var cmds = init._1;
		var subs = subscriptions(model);
		dispatchEffects(managers, cmds, subs);
		callback(_elm_lang$core$Native_Scheduler.succeed(model));
	});

	function onMessage(msg, model)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
			var results = A2(update, msg, model);
			model = results._0;
			updateView(model);
			var cmds = results._1;
			var subs = subscriptions(model);
			dispatchEffects(managers, cmds, subs);
			callback(_elm_lang$core$Native_Scheduler.succeed(model));
		});
	}

	var mainProcess = spawnLoop(initApp, onMessage);

	function enqueue(msg)
	{
		_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
	}

	var ports = setupEffects(managers, enqueue);

	return ports ? { ports: ports } : {};
}


// EFFECT MANAGERS

var effectManagers = {};

function setupEffects(managers, callback)
{
	var ports;

	// setup all necessary effect managers
	for (var key in effectManagers)
	{
		var manager = effectManagers[key];

		if (manager.isForeign)
		{
			ports = ports || {};
			ports[key] = manager.tag === 'cmd'
				? setupOutgoingPort(key)
				: setupIncomingPort(key, callback);
		}

		managers[key] = makeManager(manager, callback);
	}

	return ports;
}

function makeManager(info, callback)
{
	var router = {
		main: callback,
		self: undefined
	};

	var tag = info.tag;
	var onEffects = info.onEffects;
	var onSelfMsg = info.onSelfMsg;

	function onMessage(msg, state)
	{
		if (msg.ctor === 'self')
		{
			return A3(onSelfMsg, router, msg._0, state);
		}

		var fx = msg._0;
		switch (tag)
		{
			case 'cmd':
				return A3(onEffects, router, fx.cmds, state);

			case 'sub':
				return A3(onEffects, router, fx.subs, state);

			case 'fx':
				return A4(onEffects, router, fx.cmds, fx.subs, state);
		}
	}

	var process = spawnLoop(info.init, onMessage);
	router.self = process;
	return process;
}

function sendToApp(router, msg)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		router.main(msg);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sendToSelf(router, msg)
{
	return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
		ctor: 'self',
		_0: msg
	});
}


// HELPER for STATEFUL LOOPS

function spawnLoop(init, onMessage)
{
	var andThen = _elm_lang$core$Native_Scheduler.andThen;

	function loop(state)
	{
		var handleMsg = _elm_lang$core$Native_Scheduler.receive(function(msg) {
			return onMessage(msg, state);
		});
		return A2(andThen, loop, handleMsg);
	}

	var task = A2(andThen, loop, init);

	return _elm_lang$core$Native_Scheduler.rawSpawn(task);
}


// BAGS

function leaf(home)
{
	return function(value)
	{
		return {
			type: 'leaf',
			home: home,
			value: value
		};
	};
}

function batch(list)
{
	return {
		type: 'node',
		branches: list
	};
}

function map(tagger, bag)
{
	return {
		type: 'map',
		tagger: tagger,
		tree: bag
	}
}


// PIPE BAGS INTO EFFECT MANAGERS

function dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	gatherEffects(true, cmdBag, effectsDict, null);
	gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		var fx = home in effectsDict
			? effectsDict[home]
			: {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};

		_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
	}
}

function gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.type)
	{
		case 'leaf':
			var home = bag.home;
			var effect = toEffect(isCmd, home, taggers, bag.value);
			effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
			return;

		case 'node':
			var list = bag.branches;
			while (list.ctor !== '[]')
			{
				gatherEffects(isCmd, list._0, effectsDict, taggers);
				list = list._1;
			}
			return;

		case 'map':
			gatherEffects(isCmd, bag.tree, effectsDict, {
				tagger: bag.tagger,
				rest: taggers
			});
			return;
	}
}

function toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		var temp = taggers;
		while (temp)
		{
			x = temp.tagger(x);
			temp = temp.rest;
		}
		return x;
	}

	var map = isCmd
		? effectManagers[home].cmdMap
		: effectManagers[home].subMap;

	return A2(map, applyTaggers, value)
}

function insert(isCmd, newEffect, effects)
{
	effects = effects || {
		cmds: _elm_lang$core$Native_List.Nil,
		subs: _elm_lang$core$Native_List.Nil
	};
	if (isCmd)
	{
		effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
		return effects;
	}
	effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
	return effects;
}


// PORTS

function checkPortName(name)
{
	if (name in effectManagers)
	{
		throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
	}
}


// OUTGOING PORTS

function outgoingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'cmd',
		cmdMap: outgoingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var outgoingPortMap = F2(function cmdMap(tagger, value) {
	return value;
});

function setupOutgoingPort(name)
{
	var subs = [];
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, cmdList, state)
	{
		while (cmdList.ctor !== '[]')
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = converter(cmdList._0);
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
			cmdList = cmdList._1;
		}
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}


// INCOMING PORTS

function incomingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'sub',
		subMap: incomingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var incomingPortMap = F2(function subMap(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});

function setupIncomingPort(name, callback)
{
	var sentBeforeInit = [];
	var subs = _elm_lang$core$Native_List.Nil;
	var converter = effectManagers[name].converter;
	var currentOnEffects = preInitOnEffects;
	var currentSend = preInitSend;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function preInitOnEffects(router, subList, state)
	{
		var postInitResult = postInitOnEffects(router, subList, state);

		for(var i = 0; i < sentBeforeInit.length; i++)
		{
			postInitSend(sentBeforeInit[i]);
		}

		sentBeforeInit = null; // to release objects held in queue
		currentSend = postInitSend;
		currentOnEffects = postInitOnEffects;
		return postInitResult;
	}

	function postInitOnEffects(router, subList, state)
	{
		subs = subList;
		return init;
	}

	function onEffects(router, subList, state)
	{
		return currentOnEffects(router, subList, state);
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function preInitSend(value)
	{
		sentBeforeInit.push(value);
	}

	function postInitSend(value)
	{
		var temp = subs;
		while (temp.ctor !== '[]')
		{
			callback(temp._0(value));
			temp = temp._1;
		}
	}

	function send(incomingValue)
	{
		var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, incomingValue);
		if (result.ctor === 'Err')
		{
			throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
		}

		currentSend(result._0);
	}

	return { send: send };
}

return {
	// routers
	sendToApp: F2(sendToApp),
	sendToSelf: F2(sendToSelf),

	// global setup
	effectManagers: effectManagers,
	outgoingPort: outgoingPort,
	incomingPort: incomingPort,

	htmlToProgram: htmlToProgram,
	program: program,
	programWithFlags: programWithFlags,
	initialize: initialize,

	// effect bags
	leaf: leaf,
	batch: batch,
	map: F2(map)
};

}();

var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
_elm_lang$core$Platform_Cmd_ops['!'] = F2(
	function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Cmd$Cmd = {ctor: 'Cmd'};

var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Sub$Sub = {ctor: 'Sub'};

var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
var _elm_lang$core$Platform$programWithFlags = _elm_lang$core$Native_Platform.programWithFlags;
var _elm_lang$core$Platform$program = _elm_lang$core$Native_Platform.program;
var _elm_lang$core$Platform$Program = {ctor: 'Program'};
var _elm_lang$core$Platform$Task = {ctor: 'Task'};
var _elm_lang$core$Platform$ProcessId = {ctor: 'ProcessId'};
var _elm_lang$core$Platform$Router = {ctor: 'Router'};

var _elm_lang$core$Result$toMaybe = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$Result$withDefault = F2(
	function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
var _elm_lang$core$Result$Err = function (a) {
	return {ctor: 'Err', _0: a};
};
var _elm_lang$core$Result$andThen = F2(
	function (callback, result) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
var _elm_lang$core$Result$Ok = function (a) {
	return {ctor: 'Ok', _0: a};
};
var _elm_lang$core$Result$map = F2(
	function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
var _elm_lang$core$Result$map2 = F3(
	function (func, ra, rb) {
		var _p4 = {ctor: '_Tuple2', _0: ra, _1: rb};
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(
					A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
var _elm_lang$core$Result$map3 = F4(
	function (func, ra, rb, rc) {
		var _p5 = {ctor: '_Tuple3', _0: ra, _1: rb, _2: rc};
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(
						A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
var _elm_lang$core$Result$map4 = F5(
	function (func, ra, rb, rc, rd) {
		var _p6 = {ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd};
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(
							A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
var _elm_lang$core$Result$map5 = F6(
	function (func, ra, rb, rc, rd, re) {
		var _p7 = {ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re};
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(
								A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
var _elm_lang$core$Result$mapError = F2(
	function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(
				f(_p8._0));
		}
	});
var _elm_lang$core$Result$fromMaybe = F2(
	function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_Debug = function() {

function log(tag, value)
{
	var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
	var process = process || {};
	if (process.stdout)
	{
		process.stdout.write(msg);
	}
	else
	{
		console.log(msg);
	}
	return value;
}

function crash(message)
{
	throw new Error(message);
}

return {
	crash: crash,
	log: F2(log)
};

}();
//import Maybe, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_String = function() {

function isEmpty(str)
{
	return str.length === 0;
}
function cons(chr, str)
{
	return chr + str;
}
function uncons(str)
{
	var hd = str[0];
	if (hd)
	{
		return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
	}
	return _elm_lang$core$Maybe$Nothing;
}
function append(a, b)
{
	return a + b;
}
function concat(strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join('');
}
function length(str)
{
	return str.length;
}
function map(f, str)
{
	var out = str.split('');
	for (var i = out.length; i--; )
	{
		out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
	}
	return out.join('');
}
function filter(pred, str)
{
	return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
}
function reverse(str)
{
	return str.split('').reverse().join('');
}
function foldl(f, b, str)
{
	var len = str.length;
	for (var i = 0; i < len; ++i)
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function foldr(f, b, str)
{
	for (var i = str.length; i--; )
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function split(sep, str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(sep));
}
function join(sep, strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join(sep);
}
function repeat(n, str)
{
	var result = '';
	while (n > 0)
	{
		if (n & 1)
		{
			result += str;
		}
		n >>= 1, str += str;
	}
	return result;
}
function slice(start, end, str)
{
	return str.slice(start, end);
}
function left(n, str)
{
	return n < 1 ? '' : str.slice(0, n);
}
function right(n, str)
{
	return n < 1 ? '' : str.slice(-n);
}
function dropLeft(n, str)
{
	return n < 1 ? str : str.slice(n);
}
function dropRight(n, str)
{
	return n < 1 ? str : str.slice(0, -n);
}
function pad(n, chr, str)
{
	var half = (n - str.length) / 2;
	return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
}
function padRight(n, chr, str)
{
	return str + repeat(n - str.length, chr);
}
function padLeft(n, chr, str)
{
	return repeat(n - str.length, chr) + str;
}

function trim(str)
{
	return str.trim();
}
function trimLeft(str)
{
	return str.replace(/^\s+/, '');
}
function trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function words(str)
{
	return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
}
function lines(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
}

function toUpper(str)
{
	return str.toUpperCase();
}
function toLower(str)
{
	return str.toLowerCase();
}

function any(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return true;
		}
	}
	return false;
}
function all(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (!pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return false;
		}
	}
	return true;
}

function contains(sub, str)
{
	return str.indexOf(sub) > -1;
}
function startsWith(sub, str)
{
	return str.indexOf(sub) === 0;
}
function endsWith(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
}
function indexes(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _elm_lang$core$Native_List.Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _elm_lang$core$Native_List.fromArray(is);
}


function toInt(s)
{
	var len = s.length;

	// if empty
	if (len === 0)
	{
		return intErr(s);
	}

	// if hex
	var c = s[0];
	if (c === '0' && s[1] === 'x')
	{
		for (var i = 2; i < len; ++i)
		{
			var c = s[i];
			if (('0' <= c && c <= '9') || ('A' <= c && c <= 'F') || ('a' <= c && c <= 'f'))
			{
				continue;
			}
			return intErr(s);
		}
		return _elm_lang$core$Result$Ok(parseInt(s, 16));
	}

	// is decimal
	if (c > '9' || (c < '0' && c !== '-' && c !== '+'))
	{
		return intErr(s);
	}
	for (var i = 1; i < len; ++i)
	{
		var c = s[i];
		if (c < '0' || '9' < c)
		{
			return intErr(s);
		}
	}

	return _elm_lang$core$Result$Ok(parseInt(s, 10));
}

function intErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int");
}


function toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return floatErr(s);
	}
	var n = +s;
	// faster isNaN check
	return n === n ? _elm_lang$core$Result$Ok(n) : floatErr(s);
}

function floatErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float");
}


function toList(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
}
function fromList(chars)
{
	return _elm_lang$core$Native_List.toArray(chars).join('');
}

return {
	isEmpty: isEmpty,
	cons: F2(cons),
	uncons: uncons,
	append: F2(append),
	concat: concat,
	length: length,
	map: F2(map),
	filter: F2(filter),
	reverse: reverse,
	foldl: F3(foldl),
	foldr: F3(foldr),

	split: F2(split),
	join: F2(join),
	repeat: F2(repeat),

	slice: F3(slice),
	left: F2(left),
	right: F2(right),
	dropLeft: F2(dropLeft),
	dropRight: F2(dropRight),

	pad: F3(pad),
	padLeft: F3(padLeft),
	padRight: F3(padRight),

	trim: trim,
	trimLeft: trimLeft,
	trimRight: trimRight,

	words: words,
	lines: lines,

	toUpper: toUpper,
	toLower: toLower,

	any: F2(any),
	all: F2(all),

	contains: F2(contains),
	startsWith: F2(startsWith),
	endsWith: F2(endsWith),
	indexes: F2(indexes),

	toInt: toInt,
	toFloat: toFloat,
	toList: toList,
	fromList: fromList
};

}();

var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
var _elm_lang$core$String$fromChar = function ($char) {
	return A2(_elm_lang$core$String$cons, $char, '');
};
var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

var _elm_lang$core$Dict$foldr = F3(
	function (f, acc, t) {
		foldr:
		while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
					_v2 = A3(
					f,
					_p0._1,
					_p0._2,
					A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
					_v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
var _elm_lang$core$Dict$keys = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return {ctor: '::', _0: key, _1: keyList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$values = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return {ctor: '::', _0: value, _1: valueList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$toList = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: key, _1: value},
					_1: list
				};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
					_v6 = A3(
					f,
					_p1._1,
					_p1._2,
					A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
					_v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
var _elm_lang$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _p2) {
				stepState:
				while (true) {
					var _p3 = _p2;
					var _p9 = _p3._1;
					var _p8 = _p3._0;
					var _p4 = _p8;
					if (_p4.ctor === '[]') {
						return {
							ctor: '_Tuple2',
							_0: _p8,
							_1: A3(rightStep, rKey, rValue, _p9)
						};
					} else {
						var _p7 = _p4._1;
						var _p6 = _p4._0._1;
						var _p5 = _p4._0._0;
						if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) {
							var _v10 = rKey,
								_v11 = rValue,
								_v12 = {
								ctor: '_Tuple2',
								_0: _p7,
								_1: A3(leftStep, _p5, _p6, _p9)
							};
							rKey = _v10;
							rValue = _v11;
							_p2 = _v12;
							continue stepState;
						} else {
							if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) {
								return {
									ctor: '_Tuple2',
									_0: _p8,
									_1: A3(rightStep, rKey, rValue, _p9)
								};
							} else {
								return {
									ctor: '_Tuple2',
									_0: _p7,
									_1: A4(bothStep, _p5, _p6, rValue, _p9)
								};
							}
						}
					}
				}
			});
		var _p10 = A3(
			_elm_lang$core$Dict$foldl,
			stepState,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Dict$toList(leftDict),
				_1: initialResult
			},
			rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(
			_elm_lang$core$List$foldl,
			F2(
				function (_p11, result) {
					var _p12 = _p11;
					return A3(leftStep, _p12._0, _p12._1, result);
				}),
			intermediateResult,
			leftovers);
	});
var _elm_lang$core$Dict$reportRemBug = F4(
	function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(
			_elm_lang$core$String$concat(
				{
					ctor: '::',
					_0: 'Internal red-black tree invariant violated, expected ',
					_1: {
						ctor: '::',
						_0: msg,
						_1: {
							ctor: '::',
							_0: ' and got ',
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Basics$toString(c),
								_1: {
									ctor: '::',
									_0: '/',
									_1: {
										ctor: '::',
										_0: lgot,
										_1: {
											ctor: '::',
											_0: '/',
											_1: {
												ctor: '::',
												_0: rgot,
												_1: {
													ctor: '::',
													_0: '\nPlease report this bug to <https://github.com/elm-lang/core/issues>',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}));
	});
var _elm_lang$core$Dict$isBBlack = function (dict) {
	var _p13 = dict;
	_v14_2:
	do {
		if (_p13.ctor === 'RBNode_elm_builtin') {
			if (_p13._0.ctor === 'BBlack') {
				return true;
			} else {
				break _v14_2;
			}
		} else {
			if (_p13._0.ctor === 'LBBlack') {
				return true;
			} else {
				break _v14_2;
			}
		}
	} while(false);
	return false;
};
var _elm_lang$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v16 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
					_v17 = _p14._3;
				n = _v16;
				dict = _v17;
				continue sizeHelp;
			}
		}
	});
var _elm_lang$core$Dict$size = function (dict) {
	return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
};
var _elm_lang$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v20 = targetKey,
							_v21 = _p15._3;
						targetKey = _v20;
						dict = _v21;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v22 = targetKey,
							_v23 = _p15._4;
						targetKey = _v22;
						dict = _v23;
						continue get;
				}
			}
		}
	});
var _elm_lang$core$Dict$member = F2(
	function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var _elm_lang$core$Dict$maxWithDefault = F3(
	function (k, v, r) {
		maxWithDefault:
		while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return {ctor: '_Tuple2', _0: k, _1: v};
			} else {
				var _v26 = _p18._1,
					_v27 = _p18._2,
					_v28 = _p18._4;
				k = _v26;
				v = _v27;
				r = _v28;
				continue maxWithDefault;
			}
		}
	});
var _elm_lang$core$Dict$NBlack = {ctor: 'NBlack'};
var _elm_lang$core$Dict$BBlack = {ctor: 'BBlack'};
var _elm_lang$core$Dict$Black = {ctor: 'Black'};
var _elm_lang$core$Dict$blackish = function (t) {
	var _p19 = t;
	if (_p19.ctor === 'RBNode_elm_builtin') {
		var _p20 = _p19._0;
		return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
	} else {
		return true;
	}
};
var _elm_lang$core$Dict$Red = {ctor: 'Red'};
var _elm_lang$core$Dict$moreBlack = function (color) {
	var _p21 = color;
	switch (_p21.ctor) {
		case 'Black':
			return _elm_lang$core$Dict$BBlack;
		case 'Red':
			return _elm_lang$core$Dict$Black;
		case 'NBlack':
			return _elm_lang$core$Dict$Red;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
	}
};
var _elm_lang$core$Dict$lessBlack = function (color) {
	var _p22 = color;
	switch (_p22.ctor) {
		case 'BBlack':
			return _elm_lang$core$Dict$Black;
		case 'Black':
			return _elm_lang$core$Dict$Red;
		case 'Red':
			return _elm_lang$core$Dict$NBlack;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
	}
};
var _elm_lang$core$Dict$LBBlack = {ctor: 'LBBlack'};
var _elm_lang$core$Dict$LBlack = {ctor: 'LBlack'};
var _elm_lang$core$Dict$RBEmpty_elm_builtin = function (a) {
	return {ctor: 'RBEmpty_elm_builtin', _0: a};
};
var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
var _elm_lang$core$Dict$isEmpty = function (dict) {
	return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
};
var _elm_lang$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e};
	});
var _elm_lang$core$Dict$ensureBlackRoot = function (dict) {
	var _p23 = dict;
	if ((_p23.ctor === 'RBNode_elm_builtin') && (_p23._0.ctor === 'Red')) {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
	} else {
		return dict;
	}
};
var _elm_lang$core$Dict$lessBlackTree = function (dict) {
	var _p24 = dict;
	if (_p24.ctor === 'RBNode_elm_builtin') {
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$lessBlack(_p24._0),
			_p24._1,
			_p24._2,
			_p24._3,
			_p24._4);
	} else {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	}
};
var _elm_lang$core$Dict$balancedTree = function (col) {
	return function (xk) {
		return function (xv) {
			return function (yk) {
				return function (yv) {
					return function (zk) {
						return function (zv) {
							return function (a) {
								return function (b) {
									return function (c) {
										return function (d) {
											return A5(
												_elm_lang$core$Dict$RBNode_elm_builtin,
												_elm_lang$core$Dict$lessBlack(col),
												yk,
												yv,
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b),
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$core$Dict$blacken = function (t) {
	var _p25 = t;
	if (_p25.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
	}
};
var _elm_lang$core$Dict$redden = function (t) {
	var _p26 = t;
	if (_p26.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
	}
};
var _elm_lang$core$Dict$balanceHelp = function (tree) {
	var _p27 = tree;
	_v36_6:
	do {
		_v36_5:
		do {
			_v36_4:
			do {
				_v36_3:
				do {
					_v36_2:
					do {
						_v36_1:
						do {
							_v36_0:
							do {
								if (_p27.ctor === 'RBNode_elm_builtin') {
									if (_p27._3.ctor === 'RBNode_elm_builtin') {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._3._0.ctor) {
												case 'Red':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																		break _v36_2;
																	} else {
																		if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																			break _v36_3;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															}
														case 'NBlack':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																		break _v36_4;
																	} else {
																		break _v36_6;
																	}
																}
															}
														default:
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	break _v36_6;
																}
															}
													}
												case 'NBlack':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															}
														case 'NBlack':
															if (_p27._0.ctor === 'BBlack') {
																if ((((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																	break _v36_4;
																} else {
																	if ((((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															} else {
																break _v36_6;
															}
														default:
															if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																break _v36_5;
															} else {
																break _v36_6;
															}
													}
												default:
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	break _v36_6;
																}
															}
														case 'NBlack':
															if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																break _v36_4;
															} else {
																break _v36_6;
															}
														default:
															break _v36_6;
													}
											}
										} else {
											switch (_p27._3._0.ctor) {
												case 'Red':
													if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
														break _v36_0;
													} else {
														if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
															break _v36_1;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
														break _v36_5;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										}
									} else {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._4._0.ctor) {
												case 'Red':
													if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
														break _v36_2;
													} else {
														if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
															break _v36_3;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
														break _v36_4;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										} else {
											break _v36_6;
										}
									}
								} else {
									break _v36_6;
								}
							} while(false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
						} while(false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
					} while(false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
				} while(false);
				return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
			} while(false);
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_elm_lang$core$Dict$Black,
				_p27._4._3._1,
				_p27._4._3._2,
				A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3),
				A5(
					_elm_lang$core$Dict$balance,
					_elm_lang$core$Dict$Black,
					_p27._4._1,
					_p27._4._2,
					_p27._4._3._4,
					_elm_lang$core$Dict$redden(_p27._4._4)));
		} while(false);
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$Black,
			_p27._3._4._1,
			_p27._3._4._2,
			A5(
				_elm_lang$core$Dict$balance,
				_elm_lang$core$Dict$Black,
				_p27._3._1,
				_p27._3._2,
				_elm_lang$core$Dict$redden(_p27._3._3),
				_p27._3._4._3),
			A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
	} while(false);
	return tree;
};
var _elm_lang$core$Dict$balance = F5(
	function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
var _elm_lang$core$Dict$bubble = F5(
	function (c, k, v, l, r) {
		return (_elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r)) ? A5(
			_elm_lang$core$Dict$balance,
			_elm_lang$core$Dict$moreBlack(c),
			k,
			v,
			_elm_lang$core$Dict$lessBlackTree(l),
			_elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
var _elm_lang$core$Dict$removeMax = F5(
	function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(
				_elm_lang$core$Dict$bubble,
				c,
				k,
				v,
				l,
				A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
var _elm_lang$core$Dict$rem = F3(
	function (color, left, right) {
		var _p29 = {ctor: '_Tuple2', _0: left, _1: right};
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = color;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = {ctor: '_Tuple3', _0: color, _1: _p32, _2: _p33};
				if ((((_p31.ctor === '_Tuple3') && (_p31._0.ctor === 'Black')) && (_p31._1.ctor === 'LBlack')) && (_p31._2.ctor === 'Red')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/LBlack/Red',
						color,
						_elm_lang$core$Basics$toString(_p32),
						_elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = {ctor: '_Tuple3', _0: color, _1: _p35, _2: _p36};
				if ((((_p34.ctor === '_Tuple3') && (_p34._0.ctor === 'Black')) && (_p34._1.ctor === 'Red')) && (_p34._2.ctor === 'LBlack')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/Red/LBlack',
						color,
						_elm_lang$core$Basics$toString(_p35),
						_elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var newLeft = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, color, k, v, newLeft, right);
			}
		}
	});
var _elm_lang$core$Dict$map = F2(
	function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_p41._0,
				_p42,
				A2(f, _p42, _p41._2),
				A2(_elm_lang$core$Dict$map, f, _p41._3),
				A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
var _elm_lang$core$Dict$Same = {ctor: 'Same'};
var _elm_lang$core$Dict$Remove = {ctor: 'Remove'};
var _elm_lang$core$Dict$Insert = {ctor: 'Insert'};
var _elm_lang$core$Dict$update = F3(
	function (k, alter, dict) {
		var up = function (dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return {ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(
							_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
var _elm_lang$core$Dict$insert = F3(
	function (key, value, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(
				_elm_lang$core$Maybe$Just(value)),
			dict);
	});
var _elm_lang$core$Dict$singleton = F2(
	function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
var _elm_lang$core$Dict$union = F2(
	function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
var _elm_lang$core$Dict$filter = F2(
	function (predicate, dictionary) {
		var add = F3(
			function (key, value, dict) {
				return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
			});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
var _elm_lang$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Dict$filter,
			F2(
				function (k, _p58) {
					return A2(_elm_lang$core$Dict$member, k, t2);
				}),
			t1);
	});
var _elm_lang$core$Dict$partition = F2(
	function (predicate, dict) {
		var add = F3(
			function (key, value, _p59) {
				var _p60 = _p59;
				var _p62 = _p60._1;
				var _p61 = _p60._0;
				return A2(predicate, key, value) ? {
					ctor: '_Tuple2',
					_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
					_1: _p62
				} : {
					ctor: '_Tuple2',
					_0: _p61,
					_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
				};
			});
		return A3(
			_elm_lang$core$Dict$foldl,
			add,
			{ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty},
			dict);
	});
var _elm_lang$core$Dict$fromList = function (assocs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p63, dict) {
				var _p64 = _p63;
				return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
			}),
		_elm_lang$core$Dict$empty,
		assocs);
};
var _elm_lang$core$Dict$remove = F2(
	function (key, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing),
			dict);
	});
var _elm_lang$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2(_elm_lang$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});

var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

//import Maybe, Native.Array, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_Json = function() {


// CORE DECODERS

function succeed(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'succeed',
		msg: msg
	};
}

function fail(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'fail',
		msg: msg
	};
}

function decodePrimitive(tag)
{
	return {
		ctor: '<decoder>',
		tag: tag
	};
}

function decodeContainer(tag, decoder)
{
	return {
		ctor: '<decoder>',
		tag: tag,
		decoder: decoder
	};
}

function decodeNull(value)
{
	return {
		ctor: '<decoder>',
		tag: 'null',
		value: value
	};
}

function decodeField(field, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'field',
		field: field,
		decoder: decoder
	};
}

function decodeIndex(index, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'index',
		index: index,
		decoder: decoder
	};
}

function decodeKeyValuePairs(decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'key-value',
		decoder: decoder
	};
}

function mapMany(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'map-many',
		func: f,
		decoders: decoders
	};
}

function andThen(callback, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'andThen',
		decoder: decoder,
		callback: callback
	};
}

function oneOf(decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'oneOf',
		decoders: decoders
	};
}


// DECODING OBJECTS

function map1(f, d1)
{
	return mapMany(f, [d1]);
}

function map2(f, d1, d2)
{
	return mapMany(f, [d1, d2]);
}

function map3(f, d1, d2, d3)
{
	return mapMany(f, [d1, d2, d3]);
}

function map4(f, d1, d2, d3, d4)
{
	return mapMany(f, [d1, d2, d3, d4]);
}

function map5(f, d1, d2, d3, d4, d5)
{
	return mapMany(f, [d1, d2, d3, d4, d5]);
}

function map6(f, d1, d2, d3, d4, d5, d6)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6]);
}

function map7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function map8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODE HELPERS

function ok(value)
{
	return { tag: 'ok', value: value };
}

function badPrimitive(type, value)
{
	return { tag: 'primitive', type: type, value: value };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badField(field, nestedProblems)
{
	return { tag: 'field', field: field, rest: nestedProblems };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badOneOf(problems)
{
	return { tag: 'oneOf', problems: problems };
}

function bad(msg)
{
	return { tag: 'fail', msg: msg };
}

function badToString(problem)
{
	var context = '_';
	while (problem)
	{
		switch (problem.tag)
		{
			case 'primitive':
				return 'Expecting ' + problem.type
					+ (context === '_' ? '' : ' at ' + context)
					+ ' but instead got: ' + jsToString(problem.value);

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'field':
				context += '.' + problem.field;
				problem = problem.rest;
				break;

			case 'oneOf':
				var problems = problem.problems;
				for (var i = 0; i < problems.length; i++)
				{
					problems[i] = badToString(problems[i]);
				}
				return 'I ran into the following problems'
					+ (context === '_' ? '' : ' at ' + context)
					+ ':\n\n' + problems.join('\n');

			case 'fail':
				return 'I ran into a `fail` decoder'
					+ (context === '_' ? '' : ' at ' + context)
					+ ': ' + problem.msg;
		}
	}
}

function jsToString(value)
{
	return value === undefined
		? 'undefined'
		: JSON.stringify(value);
}


// DECODE

function runOnString(decoder, string)
{
	var json;
	try
	{
		json = JSON.parse(string);
	}
	catch (e)
	{
		return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
	}
	return run(decoder, json);
}

function run(decoder, value)
{
	var result = runHelp(decoder, value);
	return (result.tag === 'ok')
		? _elm_lang$core$Result$Ok(result.value)
		: _elm_lang$core$Result$Err(badToString(result));
}

function runHelp(decoder, value)
{
	switch (decoder.tag)
	{
		case 'bool':
			return (typeof value === 'boolean')
				? ok(value)
				: badPrimitive('a Bool', value);

		case 'int':
			if (typeof value !== 'number') {
				return badPrimitive('an Int', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return ok(value);
			}

			return badPrimitive('an Int', value);

		case 'float':
			return (typeof value === 'number')
				? ok(value)
				: badPrimitive('a Float', value);

		case 'string':
			return (typeof value === 'string')
				? ok(value)
				: (value instanceof String)
					? ok(value + '')
					: badPrimitive('a String', value);

		case 'null':
			return (value === null)
				? ok(decoder.value)
				: badPrimitive('null', value);

		case 'value':
			return ok(value);

		case 'list':
			if (!(value instanceof Array))
			{
				return badPrimitive('a List', value);
			}

			var list = _elm_lang$core$Native_List.Nil;
			for (var i = value.length; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result)
				}
				list = _elm_lang$core$Native_List.Cons(result.value, list);
			}
			return ok(list);

		case 'array':
			if (!(value instanceof Array))
			{
				return badPrimitive('an Array', value);
			}

			var len = value.length;
			var array = new Array(len);
			for (var i = len; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				array[i] = result.value;
			}
			return ok(_elm_lang$core$Native_Array.fromJSArray(array));

		case 'maybe':
			var result = runHelp(decoder.decoder, value);
			return (result.tag === 'ok')
				? ok(_elm_lang$core$Maybe$Just(result.value))
				: ok(_elm_lang$core$Maybe$Nothing);

		case 'field':
			var field = decoder.field;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return badPrimitive('an object with a field named `' + field + '`', value);
			}

			var result = runHelp(decoder.decoder, value[field]);
			return (result.tag === 'ok') ? result : badField(field, result);

		case 'index':
			var index = decoder.index;
			if (!(value instanceof Array))
			{
				return badPrimitive('an array', value);
			}
			if (index >= value.length)
			{
				return badPrimitive('a longer array. Need index ' + index + ' but there are only ' + value.length + ' entries', value);
			}

			var result = runHelp(decoder.decoder, value[index]);
			return (result.tag === 'ok') ? result : badIndex(index, result);

		case 'key-value':
			if (typeof value !== 'object' || value === null || value instanceof Array)
			{
				return badPrimitive('an object', value);
			}

			var keyValuePairs = _elm_lang$core$Native_List.Nil;
			for (var key in value)
			{
				var result = runHelp(decoder.decoder, value[key]);
				if (result.tag !== 'ok')
				{
					return badField(key, result);
				}
				var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
				keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
			}
			return ok(keyValuePairs);

		case 'map-many':
			var answer = decoder.func;
			var decoders = decoder.decoders;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = runHelp(decoders[i], value);
				if (result.tag !== 'ok')
				{
					return result;
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'andThen':
			var result = runHelp(decoder.decoder, value);
			return (result.tag !== 'ok')
				? result
				: runHelp(decoder.callback(result.value), value);

		case 'oneOf':
			var errors = [];
			var temp = decoder.decoders;
			while (temp.ctor !== '[]')
			{
				var result = runHelp(temp._0, value);

				if (result.tag === 'ok')
				{
					return result;
				}

				errors.push(result);

				temp = temp._1;
			}
			return badOneOf(errors);

		case 'fail':
			return bad(decoder.msg);

		case 'succeed':
			return ok(decoder.msg);
	}
}


// EQUALITY

function equality(a, b)
{
	if (a === b)
	{
		return true;
	}

	if (a.tag !== b.tag)
	{
		return false;
	}

	switch (a.tag)
	{
		case 'succeed':
		case 'fail':
			return a.msg === b.msg;

		case 'bool':
		case 'int':
		case 'float':
		case 'string':
		case 'value':
			return true;

		case 'null':
			return a.value === b.value;

		case 'list':
		case 'array':
		case 'maybe':
		case 'key-value':
			return equality(a.decoder, b.decoder);

		case 'field':
			return a.field === b.field && equality(a.decoder, b.decoder);

		case 'index':
			return a.index === b.index && equality(a.decoder, b.decoder);

		case 'map-many':
			if (a.func !== b.func)
			{
				return false;
			}
			return listEquality(a.decoders, b.decoders);

		case 'andThen':
			return a.callback === b.callback && equality(a.decoder, b.decoder);

		case 'oneOf':
			return listEquality(a.decoders, b.decoders);
	}
}

function listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

function encode(indentLevel, value)
{
	return JSON.stringify(value, null, indentLevel);
}

function identity(value)
{
	return value;
}

function encodeObject(keyValuePairs)
{
	var obj = {};
	while (keyValuePairs.ctor !== '[]')
	{
		var pair = keyValuePairs._0;
		obj[pair._0] = pair._1;
		keyValuePairs = keyValuePairs._1;
	}
	return obj;
}

return {
	encode: F2(encode),
	runOnString: F2(runOnString),
	run: F2(run),

	decodeNull: decodeNull,
	decodePrimitive: decodePrimitive,
	decodeContainer: F2(decodeContainer),

	decodeField: F2(decodeField),
	decodeIndex: F2(decodeIndex),

	map1: F2(map1),
	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	map6: F7(map6),
	map7: F8(map7),
	map8: F9(map8),
	decodeKeyValuePairs: decodeKeyValuePairs,

	andThen: F2(andThen),
	fail: fail,
	succeed: succeed,
	oneOf: oneOf,

	identity: identity,
	encodeNull: null,
	encodeArray: _elm_lang$core$Native_Array.toJSArray,
	encodeList: _elm_lang$core$Native_List.toArray,
	encodeObject: encodeObject,

	equality: equality
};

}();

var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
var _elm_lang$core$Json_Encode$Value = {ctor: 'Value'};

var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
var _elm_lang$core$Json_Decode$lazy = function (thunk) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		thunk,
		_elm_lang$core$Json_Decode$succeed(
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
var _elm_lang$core$Json_Decode$map8 = _elm_lang$core$Native_Json.map8;
var _elm_lang$core$Json_Decode$map7 = _elm_lang$core$Native_Json.map7;
var _elm_lang$core$Json_Decode$map6 = _elm_lang$core$Native_Json.map6;
var _elm_lang$core$Json_Decode$map5 = _elm_lang$core$Native_Json.map5;
var _elm_lang$core$Json_Decode$map4 = _elm_lang$core$Native_Json.map4;
var _elm_lang$core$Json_Decode$map3 = _elm_lang$core$Native_Json.map3;
var _elm_lang$core$Json_Decode$map2 = _elm_lang$core$Native_Json.map2;
var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.map1;
var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
var _elm_lang$core$Json_Decode$maybe = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
};
var _elm_lang$core$Json_Decode$index = _elm_lang$core$Native_Json.decodeIndex;
var _elm_lang$core$Json_Decode$field = _elm_lang$core$Native_Json.decodeField;
var _elm_lang$core$Json_Decode$at = F2(
	function (fields, decoder) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$Json_Decode$field, decoder, fields);
	});
var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
var _elm_lang$core$Json_Decode$dict = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_elm_lang$core$Dict$fromList,
		_elm_lang$core$Json_Decode$keyValuePairs(decoder));
};
var _elm_lang$core$Json_Decode$array = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
};
var _elm_lang$core$Json_Decode$list = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
};
var _elm_lang$core$Json_Decode$nullable = function (decoder) {
	return _elm_lang$core$Json_Decode$oneOf(
		{
			ctor: '::',
			_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder),
				_1: {ctor: '[]'}
			}
		});
};
var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
var _elm_lang$core$Json_Decode$Decoder = {ctor: 'Decoder'};

var _elm_lang$core$Tuple$mapSecond = F2(
	function (func, _p0) {
		var _p1 = _p0;
		return {
			ctor: '_Tuple2',
			_0: _p1._0,
			_1: func(_p1._1)
		};
	});
var _elm_lang$core$Tuple$mapFirst = F2(
	function (func, _p2) {
		var _p3 = _p2;
		return {
			ctor: '_Tuple2',
			_0: func(_p3._0),
			_1: _p3._1
		};
	});
var _elm_lang$core$Tuple$second = function (_p4) {
	var _p5 = _p4;
	return _p5._1;
};
var _elm_lang$core$Tuple$first = function (_p6) {
	var _p7 = _p6;
	return _p7._0;
};

var _elm_lang$virtual_dom$VirtualDom_Debug$wrap;
var _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags;

var _elm_lang$virtual_dom$Native_VirtualDom = function() {

var STYLE_KEY = 'STYLE';
var EVENT_KEY = 'EVENT';
var ATTR_KEY = 'ATTR';
var ATTR_NS_KEY = 'ATTR_NS';

var localDoc = typeof document !== 'undefined' ? document : {};


////////////  VIRTUAL DOM NODES  ////////////


function text(string)
{
	return {
		type: 'text',
		text: string
	};
}


function node(tag)
{
	return F2(function(factList, kidList) {
		return nodeHelp(tag, factList, kidList);
	});
}


function nodeHelp(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function keyedNode(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid._1.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'keyed-node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function custom(factList, model, impl)
{
	var facts = organizeFacts(factList).facts;

	return {
		type: 'custom',
		facts: facts,
		model: model,
		impl: impl
	};
}


function map(tagger, node)
{
	return {
		type: 'tagger',
		tagger: tagger,
		node: node,
		descendantsCount: 1 + (node.descendantsCount || 0)
	};
}


function thunk(func, args, thunk)
{
	return {
		type: 'thunk',
		func: func,
		args: args,
		thunk: thunk,
		node: undefined
	};
}

function lazy(fn, a)
{
	return thunk(fn, [a], function() {
		return fn(a);
	});
}

function lazy2(fn, a, b)
{
	return thunk(fn, [a,b], function() {
		return A2(fn, a, b);
	});
}

function lazy3(fn, a, b, c)
{
	return thunk(fn, [a,b,c], function() {
		return A3(fn, a, b, c);
	});
}



// FACTS


function organizeFacts(factList)
{
	var namespace, facts = {};

	while (factList.ctor !== '[]')
	{
		var entry = factList._0;
		var key = entry.key;

		if (key === ATTR_KEY || key === ATTR_NS_KEY || key === EVENT_KEY)
		{
			var subFacts = facts[key] || {};
			subFacts[entry.realKey] = entry.value;
			facts[key] = subFacts;
		}
		else if (key === STYLE_KEY)
		{
			var styles = facts[key] || {};
			var styleList = entry.value;
			while (styleList.ctor !== '[]')
			{
				var style = styleList._0;
				styles[style._0] = style._1;
				styleList = styleList._1;
			}
			facts[key] = styles;
		}
		else if (key === 'namespace')
		{
			namespace = entry.value;
		}
		else if (key === 'className')
		{
			var classes = facts[key];
			facts[key] = typeof classes === 'undefined'
				? entry.value
				: classes + ' ' + entry.value;
		}
 		else
		{
			facts[key] = entry.value;
		}
		factList = factList._1;
	}

	return {
		facts: facts,
		namespace: namespace
	};
}



////////////  PROPERTIES AND ATTRIBUTES  ////////////


function style(value)
{
	return {
		key: STYLE_KEY,
		value: value
	};
}


function property(key, value)
{
	return {
		key: key,
		value: value
	};
}


function attribute(key, value)
{
	return {
		key: ATTR_KEY,
		realKey: key,
		value: value
	};
}


function attributeNS(namespace, key, value)
{
	return {
		key: ATTR_NS_KEY,
		realKey: key,
		value: {
			value: value,
			namespace: namespace
		}
	};
}


function on(name, options, decoder)
{
	return {
		key: EVENT_KEY,
		realKey: name,
		value: {
			options: options,
			decoder: decoder
		}
	};
}


function equalEvents(a, b)
{
	if (a.options !== b.options)
	{
		if (a.options.stopPropagation !== b.options.stopPropagation || a.options.preventDefault !== b.options.preventDefault)
		{
			return false;
		}
	}
	return _elm_lang$core$Native_Json.equality(a.decoder, b.decoder);
}


function mapProperty(func, property)
{
	if (property.key !== EVENT_KEY)
	{
		return property;
	}
	return on(
		property.realKey,
		property.value.options,
		A2(_elm_lang$core$Json_Decode$map, func, property.value.decoder)
	);
}


////////////  RENDER  ////////////


function render(vNode, eventNode)
{
	switch (vNode.type)
	{
		case 'thunk':
			if (!vNode.node)
			{
				vNode.node = vNode.thunk();
			}
			return render(vNode.node, eventNode);

		case 'tagger':
			var subNode = vNode.node;
			var tagger = vNode.tagger;

			while (subNode.type === 'tagger')
			{
				typeof tagger !== 'object'
					? tagger = [tagger, subNode.tagger]
					: tagger.push(subNode.tagger);

				subNode = subNode.node;
			}

			var subEventRoot = { tagger: tagger, parent: eventNode };
			var domNode = render(subNode, subEventRoot);
			domNode.elm_event_node_ref = subEventRoot;
			return domNode;

		case 'text':
			return localDoc.createTextNode(vNode.text);

		case 'node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i], eventNode));
			}

			return domNode;

		case 'keyed-node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i]._1, eventNode));
			}

			return domNode;

		case 'custom':
			var domNode = vNode.impl.render(vNode.model);
			applyFacts(domNode, eventNode, vNode.facts);
			return domNode;
	}
}



////////////  APPLY FACTS  ////////////


function applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		switch (key)
		{
			case STYLE_KEY:
				applyStyles(domNode, value);
				break;

			case EVENT_KEY:
				applyEvents(domNode, eventNode, value);
				break;

			case ATTR_KEY:
				applyAttrs(domNode, value);
				break;

			case ATTR_NS_KEY:
				applyAttrsNS(domNode, value);
				break;

			case 'value':
				if (domNode[key] !== value)
				{
					domNode[key] = value;
				}
				break;

			default:
				domNode[key] = value;
				break;
		}
	}
}

function applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}

function applyEvents(domNode, eventNode, events)
{
	var allHandlers = domNode.elm_handlers || {};

	for (var key in events)
	{
		var handler = allHandlers[key];
		var value = events[key];

		if (typeof value === 'undefined')
		{
			domNode.removeEventListener(key, handler);
			allHandlers[key] = undefined;
		}
		else if (typeof handler === 'undefined')
		{
			var handler = makeEventHandler(eventNode, value);
			domNode.addEventListener(key, handler);
			allHandlers[key] = handler;
		}
		else
		{
			handler.info = value;
		}
	}

	domNode.elm_handlers = allHandlers;
}

function makeEventHandler(eventNode, info)
{
	function eventHandler(event)
	{
		var info = eventHandler.info;

		var value = A2(_elm_lang$core$Native_Json.run, info.decoder, event);

		if (value.ctor === 'Ok')
		{
			var options = info.options;
			if (options.stopPropagation)
			{
				event.stopPropagation();
			}
			if (options.preventDefault)
			{
				event.preventDefault();
			}

			var message = value._0;

			var currentEventNode = eventNode;
			while (currentEventNode)
			{
				var tagger = currentEventNode.tagger;
				if (typeof tagger === 'function')
				{
					message = tagger(message);
				}
				else
				{
					for (var i = tagger.length; i--; )
					{
						message = tagger[i](message);
					}
				}
				currentEventNode = currentEventNode.parent;
			}
		}
	};

	eventHandler.info = info;

	return eventHandler;
}

function applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		if (typeof value === 'undefined')
		{
			domNode.removeAttribute(key);
		}
		else
		{
			domNode.setAttribute(key, value);
		}
	}
}

function applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.namespace;
		var value = pair.value;

		if (typeof value === 'undefined')
		{
			domNode.removeAttributeNS(namespace, key);
		}
		else
		{
			domNode.setAttributeNS(namespace, key, value);
		}
	}
}



////////////  DIFF  ////////////


function diff(a, b)
{
	var patches = [];
	diffHelp(a, b, patches, 0);
	return patches;
}


function makePatch(type, index, data)
{
	return {
		index: index,
		type: type,
		data: data,
		domNode: undefined,
		eventNode: undefined
	};
}


function diffHelp(a, b, patches, index)
{
	if (a === b)
	{
		return;
	}

	var aType = a.type;
	var bType = b.type;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (aType !== bType)
	{
		patches.push(makePatch('p-redraw', index, b));
		return;
	}

	// Now we know that both nodes are the same type.
	switch (bType)
	{
		case 'thunk':
			var aArgs = a.args;
			var bArgs = b.args;
			var i = aArgs.length;
			var same = a.func === b.func && i === bArgs.length;
			while (same && i--)
			{
				same = aArgs[i] === bArgs[i];
			}
			if (same)
			{
				b.node = a.node;
				return;
			}
			b.node = b.thunk();
			var subPatches = [];
			diffHelp(a.node, b.node, subPatches, 0);
			if (subPatches.length > 0)
			{
				patches.push(makePatch('p-thunk', index, subPatches));
			}
			return;

		case 'tagger':
			// gather nested taggers
			var aTaggers = a.tagger;
			var bTaggers = b.tagger;
			var nesting = false;

			var aSubNode = a.node;
			while (aSubNode.type === 'tagger')
			{
				nesting = true;

				typeof aTaggers !== 'object'
					? aTaggers = [aTaggers, aSubNode.tagger]
					: aTaggers.push(aSubNode.tagger);

				aSubNode = aSubNode.node;
			}

			var bSubNode = b.node;
			while (bSubNode.type === 'tagger')
			{
				nesting = true;

				typeof bTaggers !== 'object'
					? bTaggers = [bTaggers, bSubNode.tagger]
					: bTaggers.push(bSubNode.tagger);

				bSubNode = bSubNode.node;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && aTaggers.length !== bTaggers.length)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !pairwiseRefEqual(aTaggers, bTaggers) : aTaggers !== bTaggers)
			{
				patches.push(makePatch('p-tagger', index, bTaggers));
			}

			// diff everything below the taggers
			diffHelp(aSubNode, bSubNode, patches, index + 1);
			return;

		case 'text':
			if (a.text !== b.text)
			{
				patches.push(makePatch('p-text', index, b.text));
				return;
			}

			return;

		case 'node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffChildren(a, b, patches, index);
			return;

		case 'keyed-node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffKeyedChildren(a, b, patches, index);
			return;

		case 'custom':
			if (a.impl !== b.impl)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);
			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			var patch = b.impl.diff(a,b);
			if (patch)
			{
				patches.push(makePatch('p-custom', index, patch));
				return;
			}

			return;
	}
}


// assumes the incoming arrays are the same length
function pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function diffFacts(a, b, category)
{
	var diff;

	// look for changes and removals
	for (var aKey in a)
	{
		if (aKey === STYLE_KEY || aKey === EVENT_KEY || aKey === ATTR_KEY || aKey === ATTR_NS_KEY)
		{
			var subDiff = diffFacts(a[aKey], b[aKey] || {}, aKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[aKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(aKey in b))
		{
			diff = diff || {};
			diff[aKey] =
				(typeof category === 'undefined')
					? (typeof a[aKey] === 'string' ? '' : null)
					:
				(category === STYLE_KEY)
					? ''
					:
				(category === EVENT_KEY || category === ATTR_KEY)
					? undefined
					:
				{ namespace: a[aKey].namespace, value: undefined };

			continue;
		}

		var aValue = a[aKey];
		var bValue = b[aKey];

		// reference equal, so don't worry about it
		if (aValue === bValue && aKey !== 'value'
			|| category === EVENT_KEY && equalEvents(aValue, bValue))
		{
			continue;
		}

		diff = diff || {};
		diff[aKey] = bValue;
	}

	// add new stuff
	for (var bKey in b)
	{
		if (!(bKey in a))
		{
			diff = diff || {};
			diff[bKey] = b[bKey];
		}
	}

	return diff;
}


function diffChildren(aParent, bParent, patches, rootIndex)
{
	var aChildren = aParent.children;
	var bChildren = bParent.children;

	var aLen = aChildren.length;
	var bLen = bChildren.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (aLen > bLen)
	{
		patches.push(makePatch('p-remove-last', rootIndex, aLen - bLen));
	}
	else if (aLen < bLen)
	{
		patches.push(makePatch('p-append', rootIndex, bChildren.slice(aLen)));
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	var index = rootIndex;
	var minLen = aLen < bLen ? aLen : bLen;
	for (var i = 0; i < minLen; i++)
	{
		index++;
		var aChild = aChildren[i];
		diffHelp(aChild, bChildren[i], patches, index);
		index += aChild.descendantsCount || 0;
	}
}



////////////  KEYED DIFF  ////////////


function diffKeyedChildren(aParent, bParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var aChildren = aParent.children;
	var bChildren = bParent.children;
	var aLen = aChildren.length;
	var bLen = bChildren.length;
	var aIndex = 0;
	var bIndex = 0;

	var index = rootIndex;

	while (aIndex < aLen && bIndex < bLen)
	{
		var a = aChildren[aIndex];
		var b = bChildren[bIndex];

		var aKey = a._0;
		var bKey = b._0;
		var aNode = a._1;
		var bNode = b._1;

		// check if keys match

		if (aKey === bKey)
		{
			index++;
			diffHelp(aNode, bNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex++;
			bIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var aLookAhead = aIndex + 1 < aLen;
		var bLookAhead = bIndex + 1 < bLen;

		if (aLookAhead)
		{
			var aNext = aChildren[aIndex + 1];
			var aNextKey = aNext._0;
			var aNextNode = aNext._1;
			var oldMatch = bKey === aNextKey;
		}

		if (bLookAhead)
		{
			var bNext = bChildren[bIndex + 1];
			var bNextKey = bNext._0;
			var bNextNode = bNext._1;
			var newMatch = aKey === bNextKey;
		}


		// swap a and b
		if (aLookAhead && bLookAhead && newMatch && oldMatch)
		{
			index++;
			diffHelp(aNode, bNextNode, localPatches, index);
			insertNode(changes, localPatches, aKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			removeNode(changes, localPatches, aKey, aNextNode, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		// insert b
		if (bLookAhead && newMatch)
		{
			index++;
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			diffHelp(aNode, bNextNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex += 1;
			bIndex += 2;
			continue;
		}

		// remove a
		if (aLookAhead && oldMatch)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 1;
			continue;
		}

		// remove a, insert b
		if (aLookAhead && bLookAhead && aNextKey === bNextKey)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNextNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (aIndex < aLen)
	{
		index++;
		var a = aChildren[aIndex];
		var aNode = a._1;
		removeNode(changes, localPatches, a._0, aNode, index);
		index += aNode.descendantsCount || 0;
		aIndex++;
	}

	var endInserts;
	while (bIndex < bLen)
	{
		endInserts = endInserts || [];
		var b = bChildren[bIndex];
		insertNode(changes, localPatches, b._0, b._1, undefined, endInserts);
		bIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || typeof endInserts !== 'undefined')
	{
		patches.push(makePatch('p-reorder', rootIndex, {
			patches: localPatches,
			inserts: inserts,
			endInserts: endInserts
		}));
	}
}



////////////  CHANGES FROM KEYED DIFF  ////////////


var POSTFIX = '_elmW6BL';


function insertNode(changes, localPatches, key, vnode, bIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		entry = {
			tag: 'insert',
			vnode: vnode,
			index: bIndex,
			data: undefined
		};

		inserts.push({ index: bIndex, entry: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.tag === 'remove')
	{
		inserts.push({ index: bIndex, entry: entry });

		entry.tag = 'move';
		var subPatches = [];
		diffHelp(entry.vnode, vnode, subPatches, entry.index);
		entry.index = bIndex;
		entry.data.data = {
			patches: subPatches,
			entry: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	insertNode(changes, localPatches, key + POSTFIX, vnode, bIndex, inserts);
}


function removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		var patch = makePatch('p-remove', index, undefined);
		localPatches.push(patch);

		changes[key] = {
			tag: 'remove',
			vnode: vnode,
			index: index,
			data: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.tag === 'insert')
	{
		entry.tag = 'move';
		var subPatches = [];
		diffHelp(vnode, entry.vnode, subPatches, index);

		var patch = makePatch('p-remove', index, {
			patches: subPatches,
			entry: entry
		});
		localPatches.push(patch);

		return;
	}

	// this key has already been removed or moved, a duplicate!
	removeNode(changes, localPatches, key + POSTFIX, vnode, index);
}



////////////  ADD DOM NODES  ////////////
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function addDomNodes(domNode, vNode, patches, eventNode)
{
	addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.descendantsCount, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.index;

	while (index === low)
	{
		var patchType = patch.type;

		if (patchType === 'p-thunk')
		{
			addDomNodes(domNode, vNode.node, patch.data, eventNode);
		}
		else if (patchType === 'p-reorder')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var subPatches = patch.data.patches;
			if (subPatches.length > 0)
			{
				addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 'p-remove')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var data = patch.data;
			if (typeof data !== 'undefined')
			{
				data.entry.data = domNode;
				var subPatches = data.patches;
				if (subPatches.length > 0)
				{
					addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.index) > high)
		{
			return i;
		}
	}

	switch (vNode.type)
	{
		case 'tagger':
			var subNode = vNode.node;

			while (subNode.type === "tagger")
			{
				subNode = subNode.node;
			}

			return addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);

		case 'node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j];
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'keyed-node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j]._1;
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'text':
		case 'thunk':
			throw new Error('should never traverse `text` or `thunk` nodes like this');
	}
}



////////////  APPLY PATCHES  ////////////


function applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return applyPatchesHelp(rootDomNode, patches);
}

function applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.domNode
		var newNode = applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function applyPatch(domNode, patch)
{
	switch (patch.type)
	{
		case 'p-redraw':
			return applyPatchRedraw(domNode, patch.data, patch.eventNode);

		case 'p-facts':
			applyFacts(domNode, patch.eventNode, patch.data);
			return domNode;

		case 'p-text':
			domNode.replaceData(0, domNode.length, patch.data);
			return domNode;

		case 'p-thunk':
			return applyPatchesHelp(domNode, patch.data);

		case 'p-tagger':
			if (typeof domNode.elm_event_node_ref !== 'undefined')
			{
				domNode.elm_event_node_ref.tagger = patch.data;
			}
			else
			{
				domNode.elm_event_node_ref = { tagger: patch.data, parent: patch.eventNode };
			}
			return domNode;

		case 'p-remove-last':
			var i = patch.data;
			while (i--)
			{
				domNode.removeChild(domNode.lastChild);
			}
			return domNode;

		case 'p-append':
			var newNodes = patch.data;
			for (var i = 0; i < newNodes.length; i++)
			{
				domNode.appendChild(render(newNodes[i], patch.eventNode));
			}
			return domNode;

		case 'p-remove':
			var data = patch.data;
			if (typeof data === 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.entry;
			if (typeof entry.index !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.data = applyPatchesHelp(domNode, data.patches);
			return domNode;

		case 'p-reorder':
			return applyPatchReorder(domNode, patch);

		case 'p-custom':
			var impl = patch.data;
			return impl.applyPatch(domNode, impl.data);

		default:
			throw new Error('Ran into an unknown patch!');
	}
}


function applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = render(vNode, eventNode);

	if (typeof newNode.elm_event_node_ref === 'undefined')
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function applyPatchReorder(domNode, patch)
{
	var data = patch.data;

	// remove end inserts
	var frag = applyPatchReorderEndInsertsHelp(data.endInserts, patch);

	// removals
	domNode = applyPatchesHelp(domNode, data.patches);

	// inserts
	var inserts = data.inserts;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.entry;
		var node = entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode);
		domNode.insertBefore(node, domNode.childNodes[insert.index]);
	}

	// add end inserts
	if (typeof frag !== 'undefined')
	{
		domNode.appendChild(frag);
	}

	return domNode;
}


function applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (typeof endInserts === 'undefined')
	{
		return;
	}

	var frag = localDoc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.entry;
		frag.appendChild(entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode)
		);
	}
	return frag;
}


// PROGRAMS

var program = makeProgram(checkNoFlags);
var programWithFlags = makeProgram(checkYesFlags);

function makeProgram(flagChecker)
{
	return F2(function(debugWrap, impl)
	{
		return function(flagDecoder)
		{
			return function(object, moduleName, debugMetadata)
			{
				var checker = flagChecker(flagDecoder, moduleName);
				if (typeof debugMetadata === 'undefined')
				{
					normalSetup(impl, object, moduleName, checker);
				}
				else
				{
					debugSetup(A2(debugWrap, debugMetadata, impl), object, moduleName, checker);
				}
			};
		};
	});
}

function staticProgram(vNode)
{
	var nothing = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		_elm_lang$core$Platform_Cmd$none
	);
	return A2(program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, {
		init: nothing,
		view: function() { return vNode; },
		update: F2(function() { return nothing; }),
		subscriptions: function() { return _elm_lang$core$Platform_Sub$none; }
	})();
}


// FLAG CHECKERS

function checkNoFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flags === 'undefined')
		{
			return init;
		}

		var errorMessage =
			'The `' + moduleName + '` module does not need flags.\n'
			+ 'Initialize it with no arguments and you should be all set!';

		crash(errorMessage, domNode);
	};
}

function checkYesFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flagDecoder === 'undefined')
		{
			var errorMessage =
				'Are you trying to sneak a Never value into Elm? Trickster!\n'
				+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
				+ 'Use `program` instead if you do not want flags.'

			crash(errorMessage, domNode);
		}

		var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
		if (result.ctor === 'Ok')
		{
			return init(result._0);
		}

		var errorMessage =
			'Trying to initialize the `' + moduleName + '` module with an unexpected flag.\n'
			+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
			+ result._0;

		crash(errorMessage, domNode);
	};
}

function crash(errorMessage, domNode)
{
	if (domNode)
	{
		domNode.innerHTML =
			'<div style="padding-left:1em;">'
			+ '<h2 style="font-weight:normal;"><b>Oops!</b> Something went wrong when starting your Elm program.</h2>'
			+ '<pre style="padding-left:1em;">' + errorMessage + '</pre>'
			+ '</div>';
	}

	throw new Error(errorMessage);
}


//  NORMAL SETUP

function normalSetup(impl, object, moduleName, flagChecker)
{
	object['embed'] = function embed(node, flags)
	{
		while (node.lastChild)
		{
			node.removeChild(node.lastChild);
		}

		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update,
			impl.subscriptions,
			normalRenderer(node, impl.view)
		);
	};

	object['fullscreen'] = function fullscreen(flags)
	{
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update,
			impl.subscriptions,
			normalRenderer(document.body, impl.view)
		);
	};
}

function normalRenderer(parentNode, view)
{
	return function(tagger, initialModel)
	{
		var eventNode = { tagger: tagger, parent: undefined };
		var initialVirtualNode = view(initialModel);
		var domNode = render(initialVirtualNode, eventNode);
		parentNode.appendChild(domNode);
		return makeStepper(domNode, view, initialVirtualNode, eventNode);
	};
}


// STEPPER

var rAF =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { setTimeout(callback, 1000 / 60); };

function makeStepper(domNode, view, initialVirtualNode, eventNode)
{
	var state = 'NO_REQUEST';
	var currNode = initialVirtualNode;
	var nextModel;

	function updateIfNeeded()
	{
		switch (state)
		{
			case 'NO_REQUEST':
				throw new Error(
					'Unexpected draw callback.\n' +
					'Please report this to <https://github.com/elm-lang/virtual-dom/issues>.'
				);

			case 'PENDING_REQUEST':
				rAF(updateIfNeeded);
				state = 'EXTRA_REQUEST';

				var nextNode = view(nextModel);
				var patches = diff(currNode, nextNode);
				domNode = applyPatches(domNode, currNode, patches, eventNode);
				currNode = nextNode;

				return;

			case 'EXTRA_REQUEST':
				state = 'NO_REQUEST';
				return;
		}
	}

	return function stepper(model)
	{
		if (state === 'NO_REQUEST')
		{
			rAF(updateIfNeeded);
		}
		state = 'PENDING_REQUEST';
		nextModel = model;
	};
}


// DEBUG SETUP

function debugSetup(impl, object, moduleName, flagChecker)
{
	object['fullscreen'] = function fullscreen(flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, document.body, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};

	object['embed'] = function fullscreen(node, flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, node, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};
}

function scrollTask(popoutRef)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var doc = popoutRef.doc;
		if (doc)
		{
			var msgs = doc.getElementsByClassName('debugger-sidebar-messages')[0];
			if (msgs)
			{
				msgs.scrollTop = msgs.scrollHeight;
			}
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}


function debugRenderer(moduleName, parentNode, popoutRef, view, viewIn, viewOut)
{
	return function(tagger, initialModel)
	{
		var appEventNode = { tagger: tagger, parent: undefined };
		var eventNode = { tagger: tagger, parent: undefined };

		// make normal stepper
		var appVirtualNode = view(initialModel);
		var appNode = render(appVirtualNode, appEventNode);
		parentNode.appendChild(appNode);
		var appStepper = makeStepper(appNode, view, appVirtualNode, appEventNode);

		// make overlay stepper
		var overVirtualNode = viewIn(initialModel)._1;
		var overNode = render(overVirtualNode, eventNode);
		parentNode.appendChild(overNode);
		var wrappedViewIn = wrapViewIn(appEventNode, overNode, viewIn);
		var overStepper = makeStepper(overNode, wrappedViewIn, overVirtualNode, eventNode);

		// make debugger stepper
		var debugStepper = makeDebugStepper(initialModel, viewOut, eventNode, parentNode, moduleName, popoutRef);

		return function stepper(model)
		{
			appStepper(model);
			overStepper(model);
			debugStepper(model);
		}
	};
}

function makeDebugStepper(initialModel, view, eventNode, parentNode, moduleName, popoutRef)
{
	var curr;
	var domNode;

	return function stepper(model)
	{
		if (!model.isDebuggerOpen)
		{
			return;
		}

		if (!popoutRef.doc)
		{
			curr = view(model);
			domNode = openDebugWindow(moduleName, popoutRef, curr, eventNode);
			return;
		}

		// switch to document of popout
		localDoc = popoutRef.doc;

		var next = view(model);
		var patches = diff(curr, next);
		domNode = applyPatches(domNode, curr, patches, eventNode);
		curr = next;

		// switch back to normal document
		localDoc = document;
	};
}

function openDebugWindow(moduleName, popoutRef, virtualNode, eventNode)
{
	var w = 900;
	var h = 360;
	var x = screen.width - w;
	var y = screen.height - h;
	var debugWindow = window.open('', '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y);

	// switch to window document
	localDoc = debugWindow.document;

	popoutRef.doc = localDoc;
	localDoc.title = 'Debugger - ' + moduleName;
	localDoc.body.style.margin = '0';
	localDoc.body.style.padding = '0';
	var domNode = render(virtualNode, eventNode);
	localDoc.body.appendChild(domNode);

	localDoc.addEventListener('keydown', function(event) {
		if (event.metaKey && event.which === 82)
		{
			window.location.reload();
		}
		if (event.which === 38)
		{
			eventNode.tagger({ ctor: 'Up' });
			event.preventDefault();
		}
		if (event.which === 40)
		{
			eventNode.tagger({ ctor: 'Down' });
			event.preventDefault();
		}
	});

	function close()
	{
		popoutRef.doc = undefined;
		debugWindow.close();
	}
	window.addEventListener('unload', close);
	debugWindow.addEventListener('unload', function() {
		popoutRef.doc = undefined;
		window.removeEventListener('unload', close);
		eventNode.tagger({ ctor: 'Close' });
	});

	// switch back to the normal document
	localDoc = document;

	return domNode;
}


// BLOCK EVENTS

function wrapViewIn(appEventNode, overlayNode, viewIn)
{
	var ignorer = makeIgnorer(overlayNode);
	var blocking = 'Normal';
	var overflow;

	var normalTagger = appEventNode.tagger;
	var blockTagger = function() {};

	return function(model)
	{
		var tuple = viewIn(model);
		var newBlocking = tuple._0.ctor;
		appEventNode.tagger = newBlocking === 'Normal' ? normalTagger : blockTagger;
		if (blocking !== newBlocking)
		{
			traverse('removeEventListener', ignorer, blocking);
			traverse('addEventListener', ignorer, newBlocking);

			if (blocking === 'Normal')
			{
				overflow = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
			}

			if (newBlocking === 'Normal')
			{
				document.body.style.overflow = overflow;
			}

			blocking = newBlocking;
		}
		return tuple._1;
	}
}

function traverse(verbEventListener, ignorer, blocking)
{
	switch(blocking)
	{
		case 'Normal':
			return;

		case 'Pause':
			return traverseHelp(verbEventListener, ignorer, mostEvents);

		case 'Message':
			return traverseHelp(verbEventListener, ignorer, allEvents);
	}
}

function traverseHelp(verbEventListener, handler, eventNames)
{
	for (var i = 0; i < eventNames.length; i++)
	{
		document.body[verbEventListener](eventNames[i], handler, true);
	}
}

function makeIgnorer(overlayNode)
{
	return function(event)
	{
		if (event.type === 'keydown' && event.metaKey && event.which === 82)
		{
			return;
		}

		var isScroll = event.type === 'scroll' || event.type === 'wheel';

		var node = event.target;
		while (node !== null)
		{
			if (node.className === 'elm-overlay-message-details' && isScroll)
			{
				return;
			}

			if (node === overlayNode && !isScroll)
			{
				return;
			}
			node = node.parentNode;
		}

		event.stopPropagation();
		event.preventDefault();
	}
}

var mostEvents = [
	'click', 'dblclick', 'mousemove',
	'mouseup', 'mousedown', 'mouseenter', 'mouseleave',
	'touchstart', 'touchend', 'touchcancel', 'touchmove',
	'pointerdown', 'pointerup', 'pointerover', 'pointerout',
	'pointerenter', 'pointerleave', 'pointermove', 'pointercancel',
	'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
	'keyup', 'keydown', 'keypress',
	'input', 'change',
	'focus', 'blur'
];

var allEvents = mostEvents.concat('wheel', 'scroll');


return {
	node: node,
	text: text,
	custom: custom,
	map: F2(map),

	on: F3(on),
	style: style,
	property: F2(property),
	attribute: F2(attribute),
	attributeNS: F3(attributeNS),
	mapProperty: F2(mapProperty),

	lazy: F2(lazy),
	lazy2: F3(lazy2),
	lazy3: F4(lazy3),
	keyedNode: F3(keyedNode),

	program: program,
	programWithFlags: programWithFlags,
	staticProgram: staticProgram
};

}();

var _elm_lang$virtual_dom$VirtualDom$programWithFlags = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.programWithFlags, _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags, impl);
};
var _elm_lang$virtual_dom$VirtualDom$program = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, impl);
};
var _elm_lang$virtual_dom$VirtualDom$keyedNode = _elm_lang$virtual_dom$Native_VirtualDom.keyedNode;
var _elm_lang$virtual_dom$VirtualDom$lazy3 = _elm_lang$virtual_dom$Native_VirtualDom.lazy3;
var _elm_lang$virtual_dom$VirtualDom$lazy2 = _elm_lang$virtual_dom$Native_VirtualDom.lazy2;
var _elm_lang$virtual_dom$VirtualDom$lazy = _elm_lang$virtual_dom$Native_VirtualDom.lazy;
var _elm_lang$virtual_dom$VirtualDom$defaultOptions = {stopPropagation: false, preventDefault: false};
var _elm_lang$virtual_dom$VirtualDom$onWithOptions = _elm_lang$virtual_dom$Native_VirtualDom.on;
var _elm_lang$virtual_dom$VirtualDom$on = F2(
	function (eventName, decoder) {
		return A3(_elm_lang$virtual_dom$VirtualDom$onWithOptions, eventName, _elm_lang$virtual_dom$VirtualDom$defaultOptions, decoder);
	});
var _elm_lang$virtual_dom$VirtualDom$style = _elm_lang$virtual_dom$Native_VirtualDom.style;
var _elm_lang$virtual_dom$VirtualDom$mapProperty = _elm_lang$virtual_dom$Native_VirtualDom.mapProperty;
var _elm_lang$virtual_dom$VirtualDom$attributeNS = _elm_lang$virtual_dom$Native_VirtualDom.attributeNS;
var _elm_lang$virtual_dom$VirtualDom$attribute = _elm_lang$virtual_dom$Native_VirtualDom.attribute;
var _elm_lang$virtual_dom$VirtualDom$property = _elm_lang$virtual_dom$Native_VirtualDom.property;
var _elm_lang$virtual_dom$VirtualDom$map = _elm_lang$virtual_dom$Native_VirtualDom.map;
var _elm_lang$virtual_dom$VirtualDom$text = _elm_lang$virtual_dom$Native_VirtualDom.text;
var _elm_lang$virtual_dom$VirtualDom$node = _elm_lang$virtual_dom$Native_VirtualDom.node;
var _elm_lang$virtual_dom$VirtualDom$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});
var _elm_lang$virtual_dom$VirtualDom$Node = {ctor: 'Node'};
var _elm_lang$virtual_dom$VirtualDom$Property = {ctor: 'Property'};

var _elm_lang$html$Html$programWithFlags = _elm_lang$virtual_dom$VirtualDom$programWithFlags;
var _elm_lang$html$Html$program = _elm_lang$virtual_dom$VirtualDom$program;
var _elm_lang$html$Html$beginnerProgram = function (_p0) {
	var _p1 = _p0;
	return _elm_lang$html$Html$program(
		{
			init: A2(
				_elm_lang$core$Platform_Cmd_ops['!'],
				_p1.model,
				{ctor: '[]'}),
			update: F2(
				function (msg, model) {
					return A2(
						_elm_lang$core$Platform_Cmd_ops['!'],
						A2(_p1.update, msg, model),
						{ctor: '[]'});
				}),
			view: _p1.view,
			subscriptions: function (_p2) {
				return _elm_lang$core$Platform_Sub$none;
			}
		});
};
var _elm_lang$html$Html$map = _elm_lang$virtual_dom$VirtualDom$map;
var _elm_lang$html$Html$text = _elm_lang$virtual_dom$VirtualDom$text;
var _elm_lang$html$Html$node = _elm_lang$virtual_dom$VirtualDom$node;
var _elm_lang$html$Html$body = _elm_lang$html$Html$node('body');
var _elm_lang$html$Html$section = _elm_lang$html$Html$node('section');
var _elm_lang$html$Html$nav = _elm_lang$html$Html$node('nav');
var _elm_lang$html$Html$article = _elm_lang$html$Html$node('article');
var _elm_lang$html$Html$aside = _elm_lang$html$Html$node('aside');
var _elm_lang$html$Html$h1 = _elm_lang$html$Html$node('h1');
var _elm_lang$html$Html$h2 = _elm_lang$html$Html$node('h2');
var _elm_lang$html$Html$h3 = _elm_lang$html$Html$node('h3');
var _elm_lang$html$Html$h4 = _elm_lang$html$Html$node('h4');
var _elm_lang$html$Html$h5 = _elm_lang$html$Html$node('h5');
var _elm_lang$html$Html$h6 = _elm_lang$html$Html$node('h6');
var _elm_lang$html$Html$header = _elm_lang$html$Html$node('header');
var _elm_lang$html$Html$footer = _elm_lang$html$Html$node('footer');
var _elm_lang$html$Html$address = _elm_lang$html$Html$node('address');
var _elm_lang$html$Html$main_ = _elm_lang$html$Html$node('main');
var _elm_lang$html$Html$p = _elm_lang$html$Html$node('p');
var _elm_lang$html$Html$hr = _elm_lang$html$Html$node('hr');
var _elm_lang$html$Html$pre = _elm_lang$html$Html$node('pre');
var _elm_lang$html$Html$blockquote = _elm_lang$html$Html$node('blockquote');
var _elm_lang$html$Html$ol = _elm_lang$html$Html$node('ol');
var _elm_lang$html$Html$ul = _elm_lang$html$Html$node('ul');
var _elm_lang$html$Html$li = _elm_lang$html$Html$node('li');
var _elm_lang$html$Html$dl = _elm_lang$html$Html$node('dl');
var _elm_lang$html$Html$dt = _elm_lang$html$Html$node('dt');
var _elm_lang$html$Html$dd = _elm_lang$html$Html$node('dd');
var _elm_lang$html$Html$figure = _elm_lang$html$Html$node('figure');
var _elm_lang$html$Html$figcaption = _elm_lang$html$Html$node('figcaption');
var _elm_lang$html$Html$div = _elm_lang$html$Html$node('div');
var _elm_lang$html$Html$a = _elm_lang$html$Html$node('a');
var _elm_lang$html$Html$em = _elm_lang$html$Html$node('em');
var _elm_lang$html$Html$strong = _elm_lang$html$Html$node('strong');
var _elm_lang$html$Html$small = _elm_lang$html$Html$node('small');
var _elm_lang$html$Html$s = _elm_lang$html$Html$node('s');
var _elm_lang$html$Html$cite = _elm_lang$html$Html$node('cite');
var _elm_lang$html$Html$q = _elm_lang$html$Html$node('q');
var _elm_lang$html$Html$dfn = _elm_lang$html$Html$node('dfn');
var _elm_lang$html$Html$abbr = _elm_lang$html$Html$node('abbr');
var _elm_lang$html$Html$time = _elm_lang$html$Html$node('time');
var _elm_lang$html$Html$code = _elm_lang$html$Html$node('code');
var _elm_lang$html$Html$var = _elm_lang$html$Html$node('var');
var _elm_lang$html$Html$samp = _elm_lang$html$Html$node('samp');
var _elm_lang$html$Html$kbd = _elm_lang$html$Html$node('kbd');
var _elm_lang$html$Html$sub = _elm_lang$html$Html$node('sub');
var _elm_lang$html$Html$sup = _elm_lang$html$Html$node('sup');
var _elm_lang$html$Html$i = _elm_lang$html$Html$node('i');
var _elm_lang$html$Html$b = _elm_lang$html$Html$node('b');
var _elm_lang$html$Html$u = _elm_lang$html$Html$node('u');
var _elm_lang$html$Html$mark = _elm_lang$html$Html$node('mark');
var _elm_lang$html$Html$ruby = _elm_lang$html$Html$node('ruby');
var _elm_lang$html$Html$rt = _elm_lang$html$Html$node('rt');
var _elm_lang$html$Html$rp = _elm_lang$html$Html$node('rp');
var _elm_lang$html$Html$bdi = _elm_lang$html$Html$node('bdi');
var _elm_lang$html$Html$bdo = _elm_lang$html$Html$node('bdo');
var _elm_lang$html$Html$span = _elm_lang$html$Html$node('span');
var _elm_lang$html$Html$br = _elm_lang$html$Html$node('br');
var _elm_lang$html$Html$wbr = _elm_lang$html$Html$node('wbr');
var _elm_lang$html$Html$ins = _elm_lang$html$Html$node('ins');
var _elm_lang$html$Html$del = _elm_lang$html$Html$node('del');
var _elm_lang$html$Html$img = _elm_lang$html$Html$node('img');
var _elm_lang$html$Html$iframe = _elm_lang$html$Html$node('iframe');
var _elm_lang$html$Html$embed = _elm_lang$html$Html$node('embed');
var _elm_lang$html$Html$object = _elm_lang$html$Html$node('object');
var _elm_lang$html$Html$param = _elm_lang$html$Html$node('param');
var _elm_lang$html$Html$video = _elm_lang$html$Html$node('video');
var _elm_lang$html$Html$audio = _elm_lang$html$Html$node('audio');
var _elm_lang$html$Html$source = _elm_lang$html$Html$node('source');
var _elm_lang$html$Html$track = _elm_lang$html$Html$node('track');
var _elm_lang$html$Html$canvas = _elm_lang$html$Html$node('canvas');
var _elm_lang$html$Html$math = _elm_lang$html$Html$node('math');
var _elm_lang$html$Html$table = _elm_lang$html$Html$node('table');
var _elm_lang$html$Html$caption = _elm_lang$html$Html$node('caption');
var _elm_lang$html$Html$colgroup = _elm_lang$html$Html$node('colgroup');
var _elm_lang$html$Html$col = _elm_lang$html$Html$node('col');
var _elm_lang$html$Html$tbody = _elm_lang$html$Html$node('tbody');
var _elm_lang$html$Html$thead = _elm_lang$html$Html$node('thead');
var _elm_lang$html$Html$tfoot = _elm_lang$html$Html$node('tfoot');
var _elm_lang$html$Html$tr = _elm_lang$html$Html$node('tr');
var _elm_lang$html$Html$td = _elm_lang$html$Html$node('td');
var _elm_lang$html$Html$th = _elm_lang$html$Html$node('th');
var _elm_lang$html$Html$form = _elm_lang$html$Html$node('form');
var _elm_lang$html$Html$fieldset = _elm_lang$html$Html$node('fieldset');
var _elm_lang$html$Html$legend = _elm_lang$html$Html$node('legend');
var _elm_lang$html$Html$label = _elm_lang$html$Html$node('label');
var _elm_lang$html$Html$input = _elm_lang$html$Html$node('input');
var _elm_lang$html$Html$button = _elm_lang$html$Html$node('button');
var _elm_lang$html$Html$select = _elm_lang$html$Html$node('select');
var _elm_lang$html$Html$datalist = _elm_lang$html$Html$node('datalist');
var _elm_lang$html$Html$optgroup = _elm_lang$html$Html$node('optgroup');
var _elm_lang$html$Html$option = _elm_lang$html$Html$node('option');
var _elm_lang$html$Html$textarea = _elm_lang$html$Html$node('textarea');
var _elm_lang$html$Html$keygen = _elm_lang$html$Html$node('keygen');
var _elm_lang$html$Html$output = _elm_lang$html$Html$node('output');
var _elm_lang$html$Html$progress = _elm_lang$html$Html$node('progress');
var _elm_lang$html$Html$meter = _elm_lang$html$Html$node('meter');
var _elm_lang$html$Html$details = _elm_lang$html$Html$node('details');
var _elm_lang$html$Html$summary = _elm_lang$html$Html$node('summary');
var _elm_lang$html$Html$menuitem = _elm_lang$html$Html$node('menuitem');
var _elm_lang$html$Html$menu = _elm_lang$html$Html$node('menu');

var _elm_lang$html$Html_Attributes$map = _elm_lang$virtual_dom$VirtualDom$mapProperty;
var _elm_lang$html$Html_Attributes$attribute = _elm_lang$virtual_dom$VirtualDom$attribute;
var _elm_lang$html$Html_Attributes$contextmenu = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'contextmenu', value);
};
var _elm_lang$html$Html_Attributes$draggable = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'draggable', value);
};
var _elm_lang$html$Html_Attributes$itemprop = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'itemprop', value);
};
var _elm_lang$html$Html_Attributes$tabindex = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'tabIndex',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$charset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'charset', value);
};
var _elm_lang$html$Html_Attributes$height = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'height',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$width = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'width',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$formaction = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'formAction', value);
};
var _elm_lang$html$Html_Attributes$list = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'list', value);
};
var _elm_lang$html$Html_Attributes$minlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'minLength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$maxlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'maxlength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$size = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'size',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$form = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'form', value);
};
var _elm_lang$html$Html_Attributes$cols = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'cols',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rows = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rows',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$challenge = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'challenge', value);
};
var _elm_lang$html$Html_Attributes$media = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'media', value);
};
var _elm_lang$html$Html_Attributes$rel = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'rel', value);
};
var _elm_lang$html$Html_Attributes$datetime = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'datetime', value);
};
var _elm_lang$html$Html_Attributes$pubdate = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'pubdate', value);
};
var _elm_lang$html$Html_Attributes$colspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'colspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rowspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rowspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$manifest = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'manifest', value);
};
var _elm_lang$html$Html_Attributes$property = _elm_lang$virtual_dom$VirtualDom$property;
var _elm_lang$html$Html_Attributes$stringProperty = F2(
	function (name, string) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$string(string));
	});
var _elm_lang$html$Html_Attributes$class = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'className', name);
};
var _elm_lang$html$Html_Attributes$id = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'id', name);
};
var _elm_lang$html$Html_Attributes$title = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'title', name);
};
var _elm_lang$html$Html_Attributes$accesskey = function ($char) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'accessKey',
		_elm_lang$core$String$fromChar($char));
};
var _elm_lang$html$Html_Attributes$dir = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dir', value);
};
var _elm_lang$html$Html_Attributes$dropzone = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dropzone', value);
};
var _elm_lang$html$Html_Attributes$lang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'lang', value);
};
var _elm_lang$html$Html_Attributes$content = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'content', value);
};
var _elm_lang$html$Html_Attributes$httpEquiv = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'httpEquiv', value);
};
var _elm_lang$html$Html_Attributes$language = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'language', value);
};
var _elm_lang$html$Html_Attributes$src = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'src', value);
};
var _elm_lang$html$Html_Attributes$alt = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'alt', value);
};
var _elm_lang$html$Html_Attributes$preload = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'preload', value);
};
var _elm_lang$html$Html_Attributes$poster = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'poster', value);
};
var _elm_lang$html$Html_Attributes$kind = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'kind', value);
};
var _elm_lang$html$Html_Attributes$srclang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srclang', value);
};
var _elm_lang$html$Html_Attributes$sandbox = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'sandbox', value);
};
var _elm_lang$html$Html_Attributes$srcdoc = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srcdoc', value);
};
var _elm_lang$html$Html_Attributes$type_ = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'type', value);
};
var _elm_lang$html$Html_Attributes$value = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'value', value);
};
var _elm_lang$html$Html_Attributes$defaultValue = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'defaultValue', value);
};
var _elm_lang$html$Html_Attributes$placeholder = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'placeholder', value);
};
var _elm_lang$html$Html_Attributes$accept = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accept', value);
};
var _elm_lang$html$Html_Attributes$acceptCharset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'acceptCharset', value);
};
var _elm_lang$html$Html_Attributes$action = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'action', value);
};
var _elm_lang$html$Html_Attributes$autocomplete = function (bool) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var _elm_lang$html$Html_Attributes$enctype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'enctype', value);
};
var _elm_lang$html$Html_Attributes$method = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'method', value);
};
var _elm_lang$html$Html_Attributes$name = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'name', value);
};
var _elm_lang$html$Html_Attributes$pattern = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pattern', value);
};
var _elm_lang$html$Html_Attributes$for = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'htmlFor', value);
};
var _elm_lang$html$Html_Attributes$max = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'max', value);
};
var _elm_lang$html$Html_Attributes$min = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'min', value);
};
var _elm_lang$html$Html_Attributes$step = function (n) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'step', n);
};
var _elm_lang$html$Html_Attributes$wrap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'wrap', value);
};
var _elm_lang$html$Html_Attributes$usemap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'useMap', value);
};
var _elm_lang$html$Html_Attributes$shape = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'shape', value);
};
var _elm_lang$html$Html_Attributes$coords = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'coords', value);
};
var _elm_lang$html$Html_Attributes$keytype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'keytype', value);
};
var _elm_lang$html$Html_Attributes$align = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'align', value);
};
var _elm_lang$html$Html_Attributes$cite = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'cite', value);
};
var _elm_lang$html$Html_Attributes$href = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'href', value);
};
var _elm_lang$html$Html_Attributes$target = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'target', value);
};
var _elm_lang$html$Html_Attributes$downloadAs = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'download', value);
};
var _elm_lang$html$Html_Attributes$hreflang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'hreflang', value);
};
var _elm_lang$html$Html_Attributes$ping = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'ping', value);
};
var _elm_lang$html$Html_Attributes$start = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'start',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$headers = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'headers', value);
};
var _elm_lang$html$Html_Attributes$scope = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'scope', value);
};
var _elm_lang$html$Html_Attributes$boolProperty = F2(
	function (name, bool) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$bool(bool));
	});
var _elm_lang$html$Html_Attributes$hidden = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'hidden', bool);
};
var _elm_lang$html$Html_Attributes$contenteditable = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'contentEditable', bool);
};
var _elm_lang$html$Html_Attributes$spellcheck = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'spellcheck', bool);
};
var _elm_lang$html$Html_Attributes$async = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'async', bool);
};
var _elm_lang$html$Html_Attributes$defer = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'defer', bool);
};
var _elm_lang$html$Html_Attributes$scoped = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'scoped', bool);
};
var _elm_lang$html$Html_Attributes$autoplay = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autoplay', bool);
};
var _elm_lang$html$Html_Attributes$controls = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'controls', bool);
};
var _elm_lang$html$Html_Attributes$loop = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'loop', bool);
};
var _elm_lang$html$Html_Attributes$default = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'default', bool);
};
var _elm_lang$html$Html_Attributes$seamless = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'seamless', bool);
};
var _elm_lang$html$Html_Attributes$checked = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'checked', bool);
};
var _elm_lang$html$Html_Attributes$selected = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'selected', bool);
};
var _elm_lang$html$Html_Attributes$autofocus = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autofocus', bool);
};
var _elm_lang$html$Html_Attributes$disabled = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'disabled', bool);
};
var _elm_lang$html$Html_Attributes$multiple = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'multiple', bool);
};
var _elm_lang$html$Html_Attributes$novalidate = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'noValidate', bool);
};
var _elm_lang$html$Html_Attributes$readonly = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'readOnly', bool);
};
var _elm_lang$html$Html_Attributes$required = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'required', bool);
};
var _elm_lang$html$Html_Attributes$ismap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'isMap', value);
};
var _elm_lang$html$Html_Attributes$download = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'download', bool);
};
var _elm_lang$html$Html_Attributes$reversed = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'reversed', bool);
};
var _elm_lang$html$Html_Attributes$classList = function (list) {
	return _elm_lang$html$Html_Attributes$class(
		A2(
			_elm_lang$core$String$join,
			' ',
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(_elm_lang$core$List$filter, _elm_lang$core$Tuple$second, list))));
};
var _elm_lang$html$Html_Attributes$style = _elm_lang$virtual_dom$VirtualDom$style;

var _elm_lang$html$Html_Events$keyCode = A2(_elm_lang$core$Json_Decode$field, 'keyCode', _elm_lang$core$Json_Decode$int);
var _elm_lang$html$Html_Events$targetChecked = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'checked',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$bool);
var _elm_lang$html$Html_Events$targetValue = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'value',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$string);
var _elm_lang$html$Html_Events$defaultOptions = _elm_lang$virtual_dom$VirtualDom$defaultOptions;
var _elm_lang$html$Html_Events$onWithOptions = _elm_lang$virtual_dom$VirtualDom$onWithOptions;
var _elm_lang$html$Html_Events$on = _elm_lang$virtual_dom$VirtualDom$on;
var _elm_lang$html$Html_Events$onFocus = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'focus',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onBlur = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'blur',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onSubmitOptions = _elm_lang$core$Native_Utils.update(
	_elm_lang$html$Html_Events$defaultOptions,
	{preventDefault: true});
var _elm_lang$html$Html_Events$onSubmit = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'submit',
		_elm_lang$html$Html_Events$onSubmitOptions,
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onCheck = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetChecked));
};
var _elm_lang$html$Html_Events$onInput = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'input',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetValue));
};
var _elm_lang$html$Html_Events$onMouseOut = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseout',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseOver = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseover',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseLeave = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseleave',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseEnter = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseenter',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseUp = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseup',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseDown = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mousedown',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onDoubleClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'dblclick',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'click',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});

var _truqu$elm_base64$BitList$partition = F2(
	function (size, list) {
		if (_elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$List$length(list),
			size) < 1) {
			return {
				ctor: '::',
				_0: list,
				_1: {ctor: '[]'}
			};
		} else {
			var partitionTail = F3(
				function (size, list, res) {
					partitionTail:
					while (true) {
						var _p0 = list;
						if (_p0.ctor === '[]') {
							return res;
						} else {
							var _v1 = size,
								_v2 = A2(_elm_lang$core$List$drop, size, list),
								_v3 = {
								ctor: '::',
								_0: A2(_elm_lang$core$List$take, size, list),
								_1: res
							};
							size = _v1;
							list = _v2;
							res = _v3;
							continue partitionTail;
						}
					}
				});
			return _elm_lang$core$List$reverse(
				A3(
					partitionTail,
					size,
					list,
					{ctor: '[]'}));
		}
	});
var _truqu$elm_base64$BitList$toByteReverse = function (bitList) {
	var _p1 = bitList;
	if (_p1.ctor === '[]') {
		return 0;
	} else {
		if (_p1._0.ctor === 'Off') {
			return 2 * _truqu$elm_base64$BitList$toByteReverse(_p1._1);
		} else {
			return 1 + (2 * _truqu$elm_base64$BitList$toByteReverse(_p1._1));
		}
	}
};
var _truqu$elm_base64$BitList$toByte = function (bitList) {
	return _truqu$elm_base64$BitList$toByteReverse(
		_elm_lang$core$List$reverse(bitList));
};
var _truqu$elm_base64$BitList$Off = {ctor: 'Off'};
var _truqu$elm_base64$BitList$On = {ctor: 'On'};
var _truqu$elm_base64$BitList$fromNumber = function ($int) {
	return _elm_lang$core$Native_Utils.eq($int, 0) ? {ctor: '[]'} : (_elm_lang$core$Native_Utils.eq(
		A2(_elm_lang$core$Basics_ops['%'], $int, 2),
		1) ? A2(
		_elm_lang$core$List$append,
		_truqu$elm_base64$BitList$fromNumber(($int / 2) | 0),
		{
			ctor: '::',
			_0: _truqu$elm_base64$BitList$On,
			_1: {ctor: '[]'}
		}) : A2(
		_elm_lang$core$List$append,
		_truqu$elm_base64$BitList$fromNumber(($int / 2) | 0),
		{
			ctor: '::',
			_0: _truqu$elm_base64$BitList$Off,
			_1: {ctor: '[]'}
		}));
};
var _truqu$elm_base64$BitList$fromNumberWithSize = F2(
	function (number, size) {
		var bitList = _truqu$elm_base64$BitList$fromNumber(number);
		var paddingSize = size - _elm_lang$core$List$length(bitList);
		return A2(
			_elm_lang$core$List$append,
			A2(_elm_lang$core$List$repeat, paddingSize, _truqu$elm_base64$BitList$Off),
			bitList);
	});
var _truqu$elm_base64$BitList$fromByte = function ($byte) {
	return A2(_truqu$elm_base64$BitList$fromNumberWithSize, $byte, 8);
};

var _truqu$elm_base64$Base64$dropLast = F2(
	function (number, list) {
		return _elm_lang$core$List$reverse(
			A2(
				_elm_lang$core$List$drop,
				number,
				_elm_lang$core$List$reverse(list)));
	});
var _truqu$elm_base64$Base64$partitionBits = function (list) {
	var list_ = A3(
		_elm_lang$core$List$foldr,
		_elm_lang$core$List$append,
		{ctor: '[]'},
		A2(_elm_lang$core$List$map, _truqu$elm_base64$BitList$fromByte, list));
	return A2(
		_elm_lang$core$List$map,
		_truqu$elm_base64$BitList$toByte,
		A2(_truqu$elm_base64$BitList$partition, 6, list_));
};
var _truqu$elm_base64$Base64$base64CharsList = _elm_lang$core$String$toList('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/');
var _truqu$elm_base64$Base64$base64Map = function () {
	var insert = F2(
		function (_p0, dict) {
			var _p1 = _p0;
			return A3(_elm_lang$core$Dict$insert, _p1._1, _p1._0, dict);
		});
	return A3(
		_elm_lang$core$List$foldl,
		insert,
		_elm_lang$core$Dict$empty,
		A2(
			_elm_lang$core$List$indexedMap,
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			_truqu$elm_base64$Base64$base64CharsList));
}();
var _truqu$elm_base64$Base64$isValid = function (string) {
	var string_ = A2(_elm_lang$core$String$endsWith, '==', string) ? A2(_elm_lang$core$String$dropRight, 2, string) : (A2(_elm_lang$core$String$endsWith, '=', string) ? A2(_elm_lang$core$String$dropRight, 1, string) : string);
	var isBase64Char = function ($char) {
		return A2(_elm_lang$core$Dict$member, $char, _truqu$elm_base64$Base64$base64Map);
	};
	return A2(_elm_lang$core$String$all, isBase64Char, string_);
};
var _truqu$elm_base64$Base64$toBase64BitList = function (string) {
	var endingEquals = A2(_elm_lang$core$String$endsWith, '==', string) ? 2 : (A2(_elm_lang$core$String$endsWith, '=', string) ? 1 : 0);
	var stripped = _elm_lang$core$String$toList(
		A2(_elm_lang$core$String$dropRight, endingEquals, string));
	var base64ToInt = function ($char) {
		var _p2 = A2(_elm_lang$core$Dict$get, $char, _truqu$elm_base64$Base64$base64Map);
		if (_p2.ctor === 'Just') {
			return _p2._0;
		} else {
			return -1;
		}
	};
	var numberList = A2(_elm_lang$core$List$map, base64ToInt, stripped);
	return A2(
		_truqu$elm_base64$Base64$dropLast,
		endingEquals * 2,
		A2(
			_elm_lang$core$List$concatMap,
			A2(_elm_lang$core$Basics$flip, _truqu$elm_base64$BitList$fromNumberWithSize, 6),
			numberList));
};
var _truqu$elm_base64$Base64$toCharList = function (bitList) {
	var array = _elm_lang$core$Array$fromList(_truqu$elm_base64$Base64$base64CharsList);
	var toBase64Char = function (index) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			_elm_lang$core$Native_Utils.chr('!'),
			A2(_elm_lang$core$Array$get, index, array));
	};
	var toChars = function (_p3) {
		var _p4 = _p3;
		var _p5 = {ctor: '_Tuple3', _0: _p4._0, _1: _p4._1, _2: _p4._2};
		if (_p5._2 === -1) {
			if (_p5._1 === -1) {
				return A2(
					_elm_lang$core$List$append,
					A2(
						_truqu$elm_base64$Base64$dropLast,
						2,
						A2(
							_elm_lang$core$List$map,
							toBase64Char,
							_truqu$elm_base64$Base64$partitionBits(
								{
									ctor: '::',
									_0: _p5._0,
									_1: {
										ctor: '::',
										_0: 0,
										_1: {
											ctor: '::',
											_0: 0,
											_1: {ctor: '[]'}
										}
									}
								}))),
					{
						ctor: '::',
						_0: _elm_lang$core$Native_Utils.chr('='),
						_1: {
							ctor: '::',
							_0: _elm_lang$core$Native_Utils.chr('='),
							_1: {ctor: '[]'}
						}
					});
			} else {
				return A2(
					_elm_lang$core$List$append,
					A2(
						_truqu$elm_base64$Base64$dropLast,
						1,
						A2(
							_elm_lang$core$List$map,
							toBase64Char,
							_truqu$elm_base64$Base64$partitionBits(
								{
									ctor: '::',
									_0: _p5._0,
									_1: {
										ctor: '::',
										_0: _p5._1,
										_1: {
											ctor: '::',
											_0: 0,
											_1: {ctor: '[]'}
										}
									}
								}))),
					{
						ctor: '::',
						_0: _elm_lang$core$Native_Utils.chr('='),
						_1: {ctor: '[]'}
					});
			}
		} else {
			return A2(
				_elm_lang$core$List$map,
				toBase64Char,
				_truqu$elm_base64$Base64$partitionBits(
					{
						ctor: '::',
						_0: _p5._0,
						_1: {
							ctor: '::',
							_0: _p5._1,
							_1: {
								ctor: '::',
								_0: _p5._2,
								_1: {ctor: '[]'}
							}
						}
					}));
		}
	};
	return A2(_elm_lang$core$List$concatMap, toChars, bitList);
};
var _truqu$elm_base64$Base64$toTupleList = function () {
	var toTupleListHelp = F2(
		function (acc, list) {
			toTupleListHelp:
			while (true) {
				var _p6 = list;
				if (_p6.ctor === '::') {
					if (_p6._1.ctor === '::') {
						if (_p6._1._1.ctor === '::') {
							var _v5 = {
								ctor: '::',
								_0: {ctor: '_Tuple3', _0: _p6._0, _1: _p6._1._0, _2: _p6._1._1._0},
								_1: acc
							},
								_v6 = _p6._1._1._1;
							acc = _v5;
							list = _v6;
							continue toTupleListHelp;
						} else {
							return {
								ctor: '::',
								_0: {ctor: '_Tuple3', _0: _p6._0, _1: _p6._1._0, _2: -1},
								_1: acc
							};
						}
					} else {
						return {
							ctor: '::',
							_0: {ctor: '_Tuple3', _0: _p6._0, _1: -1, _2: -1},
							_1: acc
						};
					}
				} else {
					return acc;
				}
			}
		});
	return function (_p7) {
		return _elm_lang$core$List$reverse(
			A2(
				toTupleListHelp,
				{ctor: '[]'},
				_p7));
	};
}();
var _truqu$elm_base64$Base64$toCodeList = function (string) {
	return A2(
		_elm_lang$core$List$map,
		_elm_lang$core$Char$toCode,
		_elm_lang$core$String$toList(string));
};
var _truqu$elm_base64$Base64$decode = function (s) {
	if (!_truqu$elm_base64$Base64$isValid(s)) {
		return _elm_lang$core$Result$Err('Error while decoding');
	} else {
		var bitList = A2(
			_elm_lang$core$List$map,
			_truqu$elm_base64$BitList$toByte,
			A2(
				_truqu$elm_base64$BitList$partition,
				8,
				_truqu$elm_base64$Base64$toBase64BitList(s)));
		var charList = A2(_elm_lang$core$List$map, _elm_lang$core$Char$fromCode, bitList);
		return _elm_lang$core$Result$Ok(
			_elm_lang$core$String$fromList(charList));
	}
};
var _truqu$elm_base64$Base64$encode = function (s) {
	return _elm_lang$core$Result$Ok(
		_elm_lang$core$String$fromList(
			_truqu$elm_base64$Base64$toCharList(
				_truqu$elm_base64$Base64$toTupleList(
					_truqu$elm_base64$Base64$toCodeList(s)))));
};

var _user$project$Util$orMaybe = F2(
	function (alternative, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Nothing') {
			return alternative;
		} else {
			return maybe;
		}
	});
var _user$project$Util$querify = function (tuples) {
	var toQuery = function (_p1) {
		var _p2 = _p1;
		return A2(
			_elm_lang$core$Basics_ops['++'],
			_p2._0,
			A2(_elm_lang$core$Basics_ops['++'], '=', _p2._1));
	};
	return A2(
		_elm_lang$core$String$join,
		'&',
		A2(_elm_lang$core$List$map, toQuery, tuples));
};
var _user$project$Util$query = function (qstring) {
	var toTuple = function (item) {
		var last = A2(
			_elm_lang$core$Maybe$withDefault,
			'derp',
			_elm_lang$core$List$head(
				A2(_elm_lang$core$List$drop, 1, item)));
		var first = A2(
			_elm_lang$core$Maybe$withDefault,
			'herp',
			_elm_lang$core$List$head(item));
		return {ctor: '_Tuple2', _0: first, _1: last};
	};
	return A2(
		_elm_lang$core$List$map,
		toTuple,
		A2(
			_elm_lang$core$List$map,
			_elm_lang$core$String$split('='),
			A2(
				_elm_lang$core$String$split,
				'&',
				A2(_elm_lang$core$String$dropLeft, 1, qstring))));
};
var _user$project$Util$pretty = function (num) {
	var full = _elm_lang$core$Basics$toString(
		_elm_lang$core$Basics$floor(num * 10));
	return A2(
		_elm_lang$core$Basics_ops['++'],
		A2(_elm_lang$core$String$dropRight, 1, full),
		A2(
			_elm_lang$core$Basics_ops['++'],
			'.',
			A2(_elm_lang$core$String$right, 1, full)));
};
var _user$project$Util$remove = F2(
	function (index, list) {
		return A2(
			_elm_lang$core$Basics_ops['++'],
			A2(_elm_lang$core$List$take, index, list),
			A2(_elm_lang$core$List$drop, index + 1, list));
	});
var _user$project$Util$strReplace = F3(
	function (str, old, $new) {
		return A2(
			_elm_lang$core$String$join,
			$new,
			A2(_elm_lang$core$String$split, old, str));
	});
var _user$project$Util$btoa = function (string) {
	var _p3 = _truqu$elm_base64$Base64$encode(string);
	if (_p3.ctor === 'Ok') {
		return A3(_user$project$Util$strReplace, _p3._0, '=', '');
	} else {
		return _p3._0;
	}
};
var _user$project$Util$replace = F3(
	function (list, index, $new) {
		return A2(
			_elm_lang$core$List$indexedMap,
			F2(
				function (i, old) {
					return _elm_lang$core$Native_Utils.eq(i, index) ? $new : old;
				}),
			list);
	});
var _user$project$Util$find = F2(
	function (search, list) {
		return _elm_lang$core$List$head(
			A2(_elm_lang$core$List$filter, search, list));
	});
var _user$project$Util$rFind = F2(
	function (search, list) {
		return A2(
			_user$project$Util$find,
			search,
			_elm_lang$core$List$reverse(list));
	});
var _user$project$Util$queryValue = F2(
	function (qstring, key) {
		var toValue = function (tuple) {
			var _p4 = tuple;
			if ((_p4.ctor === 'Just') && (_p4._0.ctor === '_Tuple2')) {
				return _elm_lang$core$Maybe$Just(_p4._0._1);
			} else {
				return _elm_lang$core$Maybe$Nothing;
			}
		};
		return toValue(
			A2(
				_user$project$Util$find,
				function (_p5) {
					var _p6 = _p5;
					return _elm_lang$core$Native_Utils.eq(_p6._0, key);
				},
				_user$project$Util$query(qstring)));
	});
var _user$project$Util$rIndex = F2(
	function (item, list) {
		return _elm_lang$core$List$head(
			_elm_lang$core$List$reverse(
				A2(
					_elm_lang$core$List$map,
					_elm_lang$core$Tuple$first,
					A2(
						_elm_lang$core$List$filter,
						function (_p7) {
							var _p8 = _p7;
							return _elm_lang$core$Native_Utils.eq(item, _p8._1);
						},
						A2(
							_elm_lang$core$List$indexedMap,
							F2(
								function (i, a) {
									return {ctor: '_Tuple2', _0: i, _1: a};
								}),
							list)))));
	});
var _user$project$Util$index = F2(
	function (item, list) {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(
					_elm_lang$core$List$filter,
					function (_p9) {
						var _p10 = _p9;
						return _elm_lang$core$Native_Utils.eq(item, _p10._1);
					},
					A2(
						_elm_lang$core$List$indexedMap,
						F2(
							function (i, a) {
								return {ctor: '_Tuple2', _0: i, _1: a};
							}),
						list))));
	});
var _user$project$Util$atIndex = F2(
	function (index, list) {
		return _elm_lang$core$List$head(
			A2(_elm_lang$core$List$drop, index, list));
	});

var _user$project$Knight_Status$shockDamage = 78;
var _user$project$Knight_Status$fireFrequency = 2.5;
var _user$project$Knight_Status$factor = function (severity) {
	return (_elm_lang$core$Native_Utils.cmp(severity, 3) > 0) ? ((8 - severity) * 2) : (13 - severity);
};
var _user$project$Knight_Status$duration = F2(
	function (status, severity) {
		var base = function () {
			var _p0 = status;
			switch (_p0.ctor) {
				case 'Deathmark':
					return 5;
				case 'Stun':
					return 5;
				case 'Poison':
					return 15;
				case 'Sleep':
					return 15;
				case 'Curse':
					return 60;
				default:
					return 10;
			}
		}();
		return base * (1 - (_user$project$Knight_Status$factor(severity) / 30));
	});
var _user$project$Knight_Status$fireDamage = function (severity) {
	return _elm_lang$core$Basics$ceiling(
		(109 * (100 - (_user$project$Knight_Status$factor(severity) * 3.2))) / 100);
};
var _user$project$Knight_Status$poisonFactor = function (severity) {
	return 50 - (1.5 * _user$project$Knight_Status$factor(severity));
};
var _user$project$Knight_Status$spasm = function (severity) {
	return 1.6 - (5.0e-2 * _user$project$Knight_Status$factor(severity));
};
var _user$project$Knight_Status$curseDamage = function (severity) {
	return _elm_lang$core$Basics$ceiling(
		(310 * (100 - (_user$project$Knight_Status$factor(severity) * 2.5))) / 100);
};
var _user$project$Knight_Status$stunFactor = function (severity) {
	return 100 - (3 * _user$project$Knight_Status$factor(severity));
};
var _user$project$Knight_Status$sleepHeal = function (severity) {
	return _elm_lang$core$Basics$floor(
		40 - (1.47 * _user$project$Knight_Status$factor(severity)));
};
var _user$project$Knight_Status$Random = {ctor: 'Random'};
var _user$project$Knight_Status$Deathmark = {ctor: 'Deathmark'};
var _user$project$Knight_Status$Sleep = {ctor: 'Sleep'};
var _user$project$Knight_Status$Curse = {ctor: 'Curse'};
var _user$project$Knight_Status$curseSlots = function (severity) {
	return A3(
		_elm_lang$core$Basics$clamp,
		1,
		4,
		_elm_lang$core$Basics$floor(
			(A2(_user$project$Knight_Status$duration, _user$project$Knight_Status$Curse, severity) / 13) - 0.5));
};
var _user$project$Knight_Status$curseVials = function (severity) {
	return A2(
		_elm_lang$core$Basics$min,
		4,
		_elm_lang$core$Basics$ceiling(
			((A2(_user$project$Knight_Status$duration, _user$project$Knight_Status$Curse, severity) + 1) / 10) - 2));
};
var _user$project$Knight_Status$Stun = {ctor: 'Stun'};
var _user$project$Knight_Status$Poison = {ctor: 'Poison'};
var _user$project$Knight_Status$Shock = {ctor: 'Shock'};
var _user$project$Knight_Status$Freeze = {ctor: 'Freeze'};
var _user$project$Knight_Status$Fire = {ctor: 'Fire'};
var _user$project$Knight_Status$fireTicks = function (severity) {
	return _elm_lang$core$Basics$ceiling(
		1 + ((A2(_user$project$Knight_Status$duration, _user$project$Knight_Status$Fire, severity) - 0.4) / _user$project$Knight_Status$fireFrequency));
};
var _user$project$Knight_Status$fireTotal = function (severity) {
	return _user$project$Knight_Status$fireDamage(severity) * _user$project$Knight_Status$fireTicks(severity);
};

var _user$project$Knight_UV$toResistance = function (strength) {
	var _p0 = strength;
	switch (_p0.ctor) {
		case 'Low':
			return 1;
		case 'Medium':
			return 2;
		case 'High':
			return 3;
		case 'Maximum':
			return 4;
		default:
			return 0;
	}
};
var _user$project$Knight_UV$toHearts = function (effect) {
	var _p1 = effect;
	if (_p1.ctor === 'Hearts') {
		return _p1._0;
	} else {
		return 0;
	}
};
var _user$project$Knight_UV$uvMax = 25.6;
var _user$project$Knight_UV$defences = {base: 125 / 2, vita: 127 / 2, $class: 142 / 2, special: 150 / 2, plate: 200 / 2, ancient: 300 / 2, uvLow: (_user$project$Knight_UV$uvMax * 1) / 4, uvMed: (_user$project$Knight_UV$uvMax * 2) / 4, uvHigh: (_user$project$Knight_UV$uvMax * 3) / 4, uvMax: _user$project$Knight_UV$uvMax};
var _user$project$Knight_UV$toDefence = function (strength) {
	var _p2 = strength;
	switch (_p2.ctor) {
		case 'Low':
			return _user$project$Knight_UV$defences.uvLow;
		case 'Medium':
			return _user$project$Knight_UV$defences.uvMed;
		case 'High':
			return _user$project$Knight_UV$defences.uvHigh;
		case 'Maximum':
			return _user$project$Knight_UV$defences.uvMax;
		default:
			return 0;
	}
};
var _user$project$Knight_UV$Shadow = {ctor: 'Shadow'};
var _user$project$Knight_UV$Elemental = {ctor: 'Elemental'};
var _user$project$Knight_UV$Piercing = {ctor: 'Piercing'};
var _user$project$Knight_UV$Normal = {ctor: 'Normal'};
var _user$project$Knight_UV$Undead = {ctor: 'Undead'};
var _user$project$Knight_UV$Construct = {ctor: 'Construct'};
var _user$project$Knight_UV$Slime = {ctor: 'Slime'};
var _user$project$Knight_UV$Gremlin = {ctor: 'Gremlin'};
var _user$project$Knight_UV$Fiend = {ctor: 'Fiend'};
var _user$project$Knight_UV$Beast = {ctor: 'Beast'};
var _user$project$Knight_UV$BombCTR = {ctor: 'BombCTR'};
var _user$project$Knight_UV$BombDmg = {ctor: 'BombDmg'};
var _user$project$Knight_UV$GunCTR = {ctor: 'GunCTR'};
var _user$project$Knight_UV$GunASI = {ctor: 'GunASI'};
var _user$project$Knight_UV$GunDmg = {ctor: 'GunDmg'};
var _user$project$Knight_UV$SwordASI = {ctor: 'SwordASI'};
var _user$project$Knight_UV$SwordCTR = {ctor: 'SwordCTR'};
var _user$project$Knight_UV$SwordDmg = {ctor: 'SwordDmg'};
var _user$project$Knight_UV$ASI = {ctor: 'ASI'};
var _user$project$Knight_UV$CTR = {ctor: 'CTR'};
var _user$project$Knight_UV$Dmg = {ctor: 'Dmg'};
var _user$project$Knight_UV$MSI = {ctor: 'MSI'};
var _user$project$Knight_UV$NegMaximum = {ctor: 'NegMaximum'};
var _user$project$Knight_UV$NegUltra = {ctor: 'NegUltra'};
var _user$project$Knight_UV$NegVeryHigh = {ctor: 'NegVeryHigh'};
var _user$project$Knight_UV$NegHigh = {ctor: 'NegHigh'};
var _user$project$Knight_UV$NegMedium = {ctor: 'NegMedium'};
var _user$project$Knight_UV$NegLow = {ctor: 'NegLow'};
var _user$project$Knight_UV$penalties = {
	ctor: '::',
	_0: _user$project$Knight_UV$NegLow,
	_1: {
		ctor: '::',
		_0: _user$project$Knight_UV$NegMedium,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$NegHigh,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$NegVeryHigh,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_UV$NegUltra,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$NegMaximum,
						_1: {ctor: '[]'}
					}
				}
			}
		}
	}
};
var _user$project$Knight_UV$Maximum = {ctor: 'Maximum'};
var _user$project$Knight_UV$Ultra = {ctor: 'Ultra'};
var _user$project$Knight_UV$VeryHigh = {ctor: 'VeryHigh'};
var _user$project$Knight_UV$High = {ctor: 'High'};
var _user$project$Knight_UV$Medium = {ctor: 'Medium'};
var _user$project$Knight_UV$Low = {ctor: 'Low'};
var _user$project$Knight_UV$strengths = {
	ctor: '::',
	_0: _user$project$Knight_UV$Low,
	_1: {
		ctor: '::',
		_0: _user$project$Knight_UV$Medium,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$High,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$VeryHigh,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_UV$Ultra,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$Maximum,
						_1: {ctor: '[]'}
					}
				}
			}
		}
	}
};
var _user$project$Knight_UV$toBonus = function (strength) {
	var penalty = A2(
		F2(
			function (x, y) {
				return x + y;
			}),
		1,
		A2(
			_elm_lang$core$Maybe$withDefault,
			-1,
			A2(_user$project$Util$index, strength, _user$project$Knight_UV$penalties)));
	var bonus = A2(
		F2(
			function (x, y) {
				return x + y;
			}),
		1,
		A2(
			_elm_lang$core$Maybe$withDefault,
			-1,
			A2(_user$project$Util$index, strength, _user$project$Knight_UV$strengths)));
	return bonus - penalty;
};
var _user$project$Knight_UV$toDamageBonus = function (strength) {
	return 4 * _user$project$Knight_UV$toBonus(strength);
};
var _user$project$Knight_UV$DefenceUV = function (a) {
	return {ctor: 'DefenceUV', _0: a};
};
var _user$project$Knight_UV$StatusUV = function (a) {
	return {ctor: 'StatusUV', _0: a};
};
var _user$project$Knight_UV$WeaponUV = function (a) {
	return {ctor: 'WeaponUV', _0: a};
};
var _user$project$Knight_UV$Hearts = function (a) {
	return {ctor: 'Hearts', _0: a};
};

var _user$project$Knight_Types$reductionFactor = function (strength) {
	return (_elm_lang$core$Native_Utils.cmp(strength, 3) > 0) ? ((8 - strength) * 2) : (13 - strength);
};
var _user$project$Knight_Types$duration = F2(
	function (status, strength) {
		var factor = _user$project$Knight_Types$reductionFactor(strength);
		var base = function () {
			var _p0 = status;
			switch (_p0.ctor) {
				case 'Deathmark':
					return 5;
				case 'Stun':
					return 5;
				case 'Poison':
					return 15;
				case 'Curse':
					return 60;
				default:
					return 10;
			}
		}();
		return base * (1 - (factor / 30));
	});
var _user$project$Knight_Types$statusStrength = function (strength) {
	var _p1 = strength;
	switch (_p1.ctor) {
		case 'Minor':
			return 0;
		case 'Moderate':
			return 2;
		case 'Strong':
			return 4;
		default:
			return 8;
	}
};
var _user$project$Knight_Types$statusChance = function (chance) {
	var _p2 = chance;
	switch (_p2.ctor) {
		case 'Slight':
			return 15;
		case 'Fair':
			return 30;
		case 'Good':
			return 45;
		default:
			return 100;
	}
};
var _user$project$Knight_Types$Weapon = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return {id: a, name: b, weaponType: c, damageType: d, chargeTime: e, split: f, status: g, attacks: h, inflictions: i, bonuses: j};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _user$project$Knight_Types$Armour = F6(
	function (a, b, c, d, e, f) {
		return {id: a, name: b, hearts: c, defences: d, resistances: e, bonuses: f};
	});
var _user$project$Knight_Types$Shield = F3(
	function (a, b, c) {
		return {id: a, name: b, effects: c};
	});
var _user$project$Knight_Types$Trinket = F3(
	function (a, b, c) {
		return {id: a, name: b, effects: c};
	});
var _user$project$Knight_Types$Bomb = {ctor: 'Bomb'};
var _user$project$Knight_Types$Gun = {ctor: 'Gun'};
var _user$project$Knight_Types$Sword = {ctor: 'Sword'};
var _user$project$Knight_Types$Certain = {ctor: 'Certain'};
var _user$project$Knight_Types$Good = {ctor: 'Good'};
var _user$project$Knight_Types$Fair = {ctor: 'Fair'};
var _user$project$Knight_Types$Slight = {ctor: 'Slight'};
var _user$project$Knight_Types$Ultimate = {ctor: 'Ultimate'};
var _user$project$Knight_Types$Strong = {ctor: 'Strong'};
var _user$project$Knight_Types$Moderate = {ctor: 'Moderate'};
var _user$project$Knight_Types$Minor = {ctor: 'Minor'};
var _user$project$Knight_Types$Special = {ctor: 'Special'};
var _user$project$Knight_Types$Charge = {ctor: 'Charge'};
var _user$project$Knight_Types$Shot = {ctor: 'Shot'};
var _user$project$Knight_Types$Heavy = {ctor: 'Heavy'};
var _user$project$Knight_Types$Basic = {ctor: 'Basic'};

var _user$project$Knight_Values$attacks = {sword: 415 / 1.24, swordFinish: 477 / 1.24, swordCharge: 623 / 1.24, swordChargeFinish: 668 / 1.24, swordSpecial: 268 / 1.24, civ: 315, civHeavy: 353, swordLight: 361 / 1.24, swordLightFinish: 415 / 1.24, swordLightCharge: 541 / 1.24, swordLightChargeFinish: 591 / 1.24, swordHeavy: 477 / 1.24, swordHeavyFinish: 548 / 1.24, swordHeavyCharge: 668 / 1.24, swordHeavyChargeFinish: 715 / 1.24, brandish: 609 / 1.24, brandishFinish: 711 / 1.24, brandishCharge: 959 / 1.24, brandishSpecial: 447 / 1.24, brandishHeavy: 656 / 1.24, brandishHeavyFinish: 774 / 1.24, brandishHeavyCharge: 1040 / 1.24, brandishHeavySpecial: 484 / 1.24, fang: 570 / 1.24, fangFinish: 671 / 1.24, fangCharge: 904 / 1.24, blaster: 314 / 1.25, blasterCharge: 535 / 1.24, nova: 339 / 1.24, novaCharge: 576 / 1.24, driver: 297 / 1.24, driverCharge: 504 / 1.24, antigua: 231 / 1.24, antiguaCharge: 392 / 1.24, pepper: (231 / 1.24) * 0.88, pepperCharge: (391 / 1.24) * 0.88, magnus: 362 / 1.24, magnusCharge: 616 / 1.24, neutralizer: 657 / 1.24, neutralizerBlast: (657 / 1.24) / 2.45, tortofist: 252 / 1.24, nitro: 446 / 1.24, irontech: 479 / 1.24, bab: 512 / 1.24, haze: 392 / 1.24, graviton: 24 / 1.24, gravitonCollapse: 425 / 1.24, dr: 183 / 1.24, shardCore: 249 / 1.24, shardPure: 298 / 1.24, shardStatus: 273 / 1.24, shardOld: 593 / 1.24, saltOld: 305};
var _user$project$Knight_Values$charge = {quick: 1, normal: 2, $long: 3, painful: 6, irontech: 2.5};

var _user$project$Knight_Swords$everyAttack = F2(
	function (_p0, attacks) {
		var _p1 = _p0;
		var merge = function (_p2) {
			var _p3 = _p2;
			return {ctor: '_Tuple3', _0: _p3._0, _1: _p1._0, _2: _p1._1};
		};
		return A2(_elm_lang$core$List$map, merge, attacks);
	});
var _user$project$Knight_Swords$sword = {
	id: 'sword',
	weaponType: _user$project$Knight_Types$Sword,
	name: 'Stock Sword',
	damageType: _user$project$Knight_UV$Normal,
	split: _elm_lang$core$Maybe$Nothing,
	status: _elm_lang$core$Maybe$Nothing,
	chargeTime: _user$project$Knight_Values$charge.normal,
	attacks: {ctor: '[]'},
	inflictions: {ctor: '[]'},
	bonuses: {ctor: '[]'}
};
var _user$project$Knight_Swords$leviathan = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'lev',
		name: 'Leviathan Blade',
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.sword},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.swordFinish},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.swordCharge},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Knight_Swords$csaber = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$leviathan,
	{
		id: 'csaber',
		name: 'Celestial Saber',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Fire),
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Moderate},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Swords$civ = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'civ',
		name: 'Cold Iron Vanquisher',
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.civ},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.civHeavy},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.swordLightChargeFinish},
					_1: {ctor: '[]'}
				}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Undead, _1: _user$project$Knight_UV$High},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Swords$amputator = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$civ,
	{
		id: 'amp',
		name: 'Amputator',
		attacks: A2(
			_elm_lang$core$Basics_ops['++'],
			_user$project$Knight_Swords$civ.attacks,
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.blaster},
				_1: {ctor: '[]'}
			}),
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Slime, _1: _user$project$Knight_UV$High},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Swords$dreams = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'drm',
		name: 'Sweet Dreams',
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.civ},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.civHeavy},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.swordLightChargeFinish},
					_1: {ctor: '[]'}
				}
			}
		},
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Stun),
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Undead, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Moderate},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Swords$flourish = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'ff',
		name: 'Final Flourish',
		damageType: _user$project$Knight_UV$Piercing,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.sword},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.swordFinish},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.swordCharge},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.swordChargeFinish},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Knight_Swords$btb = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'btb',
		name: 'Barbarous Thorn Blade',
		damageType: _user$project$Knight_UV$Piercing,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.sword},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.swordFinish},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.swordCharge},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.swordSpecial},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Knight_Swords$rigadoon = function () {
	var rigadoonAttacks = {
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.swordLight},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.swordLightFinish},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.swordLightCharge},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.swordLightChargeFinish},
					_1: {ctor: '[]'}
				}
			}
		}
	};
	return _elm_lang$core$Native_Utils.update(
		_user$project$Knight_Swords$sword,
		{
			id: 'rig',
			name: 'Fearless Rigadoon',
			damageType: _user$project$Knight_UV$Piercing,
			status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Stun),
			attacks: rigadoonAttacks,
			inflictions: A2(
				_user$project$Knight_Swords$everyAttack,
				{ctor: '_Tuple2', _0: _user$project$Knight_Types$Slight, _1: _user$project$Knight_Types$Moderate},
				rigadoonAttacks)
		});
}();
var _user$project$Knight_Swords$flamberge = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$rigadoon,
	{
		id: 'fla',
		name: 'Furious Flamberge',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Fire),
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Types$Slight, _2: _user$project$Knight_Types$Moderate},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Types$Slight, _2: _user$project$Knight_Types$Moderate},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Fair, _2: _user$project$Knight_Types$Moderate},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Types$Fair, _2: _user$project$Knight_Types$Moderate},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Knight_Swords$hunting = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'whb',
		name: 'Wild Hunting Blade',
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.blaster},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.antigua},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.magnus},
					_1: {ctor: '[]'}
				}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Beast, _1: _user$project$Knight_UV$High},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Swords$dvs = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$hunting,
	{
		id: 'dvs',
		name: 'Dread Venom Striker',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Poison),
		bonuses: {ctor: '[]'},
		inflictions: A2(
			_user$project$Knight_Swords$everyAttack,
			{ctor: '_Tuple2', _0: _user$project$Knight_Types$Slight, _1: _user$project$Knight_Types$Strong},
			_user$project$Knight_Swords$hunting.attacks)
	});
var _user$project$Knight_Swords$turbillion = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'trb',
		name: 'Turbillion',
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.swordLight},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Values$attacks.antigua},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.swordLightFinish},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.swordLightCharge},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.driver},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});
var _user$project$Knight_Swords$suda = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'sud',
		name: 'Sudaruska',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Stun),
		chargeTime: _user$project$Knight_Values$charge.$long,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.swordHeavy},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.swordHeavyFinish},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.swordHeavyCharge},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.swordHeavyChargeFinish},
						_1: {ctor: '[]'}
					}
				}
			}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Types$Fair, _2: _user$project$Knight_Types$Moderate},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Swords$triglav = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$suda,
	{
		id: 'tri',
		name: 'Triglav',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Freeze),
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Types$Slight, _2: _user$project$Knight_Types$Moderate},
			_1: _user$project$Knight_Swords$suda.inflictions
		}
	});
var _user$project$Knight_Swords$hammer = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'wrh',
		name: 'Warmaster Rocket Hammer',
		damageType: _user$project$Knight_UV$Elemental,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.swordHeavy},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.swordLight},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.swordHeavyFinish},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.swordHeavyChargeFinish},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Knight_Swords$combuster = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'cmb',
		name: 'Combuster',
		damageType: _user$project$Knight_UV$Elemental,
		split: _elm_lang$core$Maybe$Just(_user$project$Knight_UV$Normal),
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Fire),
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.brandish},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.brandishFinish},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.brandishCharge},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.brandishSpecial},
						_1: {ctor: '[]'}
					}
				}
			}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Strong},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Strong},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Swords$glacius = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$combuster,
	{
		id: 'glc',
		name: 'Glacius',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Freeze)
	});
var _user$project$Knight_Swords$voltedge = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$combuster,
	{
		id: 'vlt',
		name: 'Voltedge',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Shock)
	});
var _user$project$Knight_Swords$obsidian = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$combuster,
	{
		id: 'obs',
		name: 'Obsidian Edge',
		damageType: _user$project$Knight_UV$Shadow,
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Poison)
	});
var _user$project$Knight_Swords$acheron = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'ach',
		name: 'Acheron',
		damageType: _user$project$Knight_UV$Shadow,
		split: _elm_lang$core$Maybe$Just(_user$project$Knight_UV$Normal),
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.brandishHeavy},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.brandishHeavyFinish},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.brandishHeavyCharge},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.brandishHeavySpecial},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Knight_Swords$avenger = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$acheron,
	{id: 'da', name: 'Divine Avenger', chargeTime: _user$project$Knight_Values$charge.$long, damageType: _user$project$Knight_UV$Elemental});
var _user$project$Knight_Swords$faust = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$acheron,
	{
		id: 'gf',
		name: 'Gran Faust',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Curse),
		chargeTime: _user$project$Knight_Values$charge.painful,
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Types$Slight, _2: _user$project$Knight_Types$Strong},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Fair, _2: _user$project$Knight_Types$Strong},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Types$Fair, _2: _user$project$Knight_Types$Strong},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Knight_Swords$faust4star = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$faust,
	{
		id: 'fau',
		name: 'Faust (4*)',
		chargeTime: _user$project$Knight_Values$charge.$long,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: 502},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: 591},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: 790},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: 338},
						_1: {ctor: '[]'}
					}
				}
			}
		}
	});
var _user$project$Knight_Swords$fang = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'fov',
		name: 'Fang of Vog',
		damageType: _user$project$Knight_UV$Elemental,
		split: _elm_lang$core$Maybe$Just(_user$project$Knight_UV$Normal),
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Fire),
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.fang},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.fangFinish},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.fangCharge},
					_1: {ctor: '[]'}
				}
			}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Types$Slight, _2: _user$project$Knight_Types$Moderate},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Types$Slight, _2: _user$project$Knight_Types$Moderate},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Strong},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Knight_Swords$winmillion = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Swords$sword,
	{
		id: 'win',
		name: 'Winmillion',
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: 300 / 1.24},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: 220 / 1.24},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: 345 / 1.24},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: 563 / 1.24},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: 322 / 1.24},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});
var _user$project$Knight_Swords$swords = {
	ctor: '::',
	_0: _user$project$Knight_Swords$leviathan,
	_1: {
		ctor: '::',
		_0: _user$project$Knight_Swords$civ,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_Swords$dreams,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Swords$csaber,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Swords$amputator,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Swords$flourish,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Swords$btb,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_Swords$rigadoon,
								_1: {
									ctor: '::',
									_0: _user$project$Knight_Swords$flamberge,
									_1: {
										ctor: '::',
										_0: _user$project$Knight_Swords$hunting,
										_1: {
											ctor: '::',
											_0: _user$project$Knight_Swords$dvs,
											_1: {
												ctor: '::',
												_0: _user$project$Knight_Swords$turbillion,
												_1: {
													ctor: '::',
													_0: _user$project$Knight_Swords$suda,
													_1: {
														ctor: '::',
														_0: _user$project$Knight_Swords$triglav,
														_1: {
															ctor: '::',
															_0: _user$project$Knight_Swords$hammer,
															_1: {
																ctor: '::',
																_0: _user$project$Knight_Swords$combuster,
																_1: {
																	ctor: '::',
																	_0: _user$project$Knight_Swords$glacius,
																	_1: {
																		ctor: '::',
																		_0: _user$project$Knight_Swords$voltedge,
																		_1: {
																			ctor: '::',
																			_0: _user$project$Knight_Swords$acheron,
																			_1: {
																				ctor: '::',
																				_0: _user$project$Knight_Swords$obsidian,
																				_1: {
																					ctor: '::',
																					_0: _user$project$Knight_Swords$avenger,
																					_1: {
																						ctor: '::',
																						_0: _user$project$Knight_Swords$faust,
																						_1: {
																							ctor: '::',
																							_0: _user$project$Knight_Swords$fang,
																							_1: {
																								ctor: '::',
																								_0: _user$project$Knight_Swords$winmillion,
																								_1: {
																									ctor: '::',
																									_0: _user$project$Knight_Swords$faust4star,
																									_1: {ctor: '[]'}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};

var _user$project$Knight_Guns$gun = {
	id: 'gun',
	weaponType: _user$project$Knight_Types$Gun,
	name: 'Stock Gun',
	damageType: _user$project$Knight_UV$Normal,
	split: _elm_lang$core$Maybe$Nothing,
	status: _elm_lang$core$Maybe$Nothing,
	chargeTime: _user$project$Knight_Values$charge.normal,
	attacks: {ctor: '[]'},
	inflictions: {ctor: '[]'},
	bonuses: {ctor: '[]'}
};
var _user$project$Knight_Guns$valiance = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$gun,
	{
		id: 'val',
		name: 'Valiance',
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Values$attacks.blaster},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.blasterCharge},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Guns$rift = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$valiance,
	{id: 'rif', name: 'Riftlocker', damageType: _user$project$Knight_UV$Piercing});
var _user$project$Knight_Guns$arcana = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$valiance,
	{id: 'arc', name: 'Arcana', damageType: _user$project$Knight_UV$Elemental});
var _user$project$Knight_Guns$phant = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$valiance,
	{id: 'pha', name: 'Phantomos', damageType: _user$project$Knight_UV$Shadow});
var _user$project$Knight_Guns$nova = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$gun,
	{
		id: 'nov',
		name: 'Nova Driver',
		damageType: _user$project$Knight_UV$Elemental,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Values$attacks.nova},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.novaCharge},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Guns$umbra = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$nova,
	{id: 'umb', name: 'Umbra Driver', damageType: _user$project$Knight_UV$Shadow});
var _user$project$Knight_Guns$magma = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$nova,
	{
		id: 'mag',
		name: 'Magma Driver',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Fire),
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Values$attacks.driver},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.driverCharge},
				_1: {ctor: '[]'}
			}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Moderate},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Moderate},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Guns$cryo = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$magma,
	{
		id: 'cry',
		name: 'Hail Driver',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Freeze)
	});
var _user$project$Knight_Guns$storm = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$magma,
	{
		id: 'sto',
		name: 'Storm Driver',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Shock)
	});
var _user$project$Knight_Guns$pepper = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$gun,
	{
		id: 'pbx',
		name: 'Volcanic Pepperbox',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Fire),
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Values$attacks.pepper},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.pepperCharge},
				_1: {ctor: '[]'}
			}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Types$Slight, _2: _user$project$Knight_Types$Moderate},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Slight, _2: _user$project$Knight_Types$Moderate},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Guns$plague = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$pepper,
	{
		id: 'plg',
		name: 'Plague Needle',
		damageType: _user$project$Knight_UV$Piercing,
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Poison),
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Types$Slight, _2: _user$project$Knight_Types$Strong},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Slight, _2: _user$project$Knight_Types$Strong},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Guns$blitz = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$gun,
	{
		id: 'blt',
		name: 'Blitz Needle',
		damageType: _user$project$Knight_UV$Piercing,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Values$attacks.antigua},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.antiguaCharge},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Guns$grim = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$blitz,
	{id: 'grm', name: 'Grim Repeater', damageType: _user$project$Knight_UV$Shadow});
var _user$project$Knight_Guns$obsidian = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$grim,
	{
		id: 'car',
		name: 'Obsidian Carbine',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Poison),
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Types$Slight, _2: _user$project$Knight_Types$Minor},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Fair, _2: _user$project$Knight_Types$Moderate},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Guns$gg = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$blitz,
	{
		id: 'gg',
		name: 'Gilded Griffin',
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Beast, _1: _user$project$Knight_UV$High},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Guns$ap = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$gg,
	{
		id: 'ap',
		name: 'Argent Peacemaker',
		damageType: _user$project$Knight_UV$Elemental,
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Undead, _1: _user$project$Knight_UV$High},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Guns$sent = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$ap,
	{
		id: 'snt',
		name: 'Sentenza',
		damageType: _user$project$Knight_UV$Shadow,
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Gremlin, _1: _user$project$Knight_UV$High},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Guns$slug = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$gun,
	{
		id: 'slg',
		name: 'Iron Slug',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Stun),
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Values$attacks.magnus},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.magnusCharge},
				_1: {ctor: '[]'}
			}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Types$Fair, _2: _user$project$Knight_Types$Moderate},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Moderate},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Guns$cal = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$slug,
	{id: 'cal', name: 'Callahan', damageType: _user$project$Knight_UV$Piercing});
var _user$project$Knight_Guns$wg = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$slug,
	{
		id: 'wg',
		name: 'Winter Grave',
		damageType: _user$project$Knight_UV$Shadow,
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Freeze)
	});
var _user$project$Knight_Guns$supernova = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$gun,
	{
		id: 'sup',
		name: 'Supernova',
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Values$attacks.driver},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.nova},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.novaCharge},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Knight_Guns$polaris = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$gun,
	{
		id: 'pol',
		name: 'Polaris',
		damageType: _user$project$Knight_UV$Elemental,
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Shock),
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Values$attacks.driver},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Values$attacks.blaster},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.blasterCharge},
					_1: {ctor: '[]'}
				}
			}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Minor},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Heavy, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Moderate},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Moderate},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Knight_Guns$wildfire = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$polaris,
	{
		id: 'wf',
		name: 'Wildfire',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Fire)
	});
var _user$project$Knight_Guns$permafroster = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$polaris,
	{
		id: 'pf',
		name: 'Permafroster',
		damageType: _user$project$Knight_UV$Shadow,
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Freeze)
	});
var _user$project$Knight_Guns$neutralizer = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$gun,
	{
		id: 'neu',
		name: 'Neutralizer',
		chargeTime: _user$project$Knight_Values$charge.quick,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.neutralizer},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.neutralizerBlast},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Guns$biohazard = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Guns$neutralizer,
	{
		id: 'bio',
		name: 'Biohazard',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Poison),
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.magnusCharge},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.driver},
				_1: {ctor: '[]'}
			}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Minor},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Types$Fair, _2: _user$project$Knight_Types$Moderate},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Guns$tortofists = function () {
	var copy = function (_p0) {
		var _p1 = _p0;
		return _elm_lang$core$Native_Utils.update(
			_user$project$Knight_Guns$gun,
			{
				id: _p1._0,
				name: _p1._1,
				damageType: _p1._2,
				attacks: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Basic, _1: _user$project$Knight_Values$attacks.tortofist},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Values$attacks.blaster},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.antiguaCharge},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.pepperCharge},
								_1: {ctor: '[]'}
							}
						}
					}
				}
			});
	};
	var variants = {
		ctor: '::',
		_0: {ctor: '_Tuple3', _0: 'grg', _1: 'Gorgofist', _2: _user$project$Knight_UV$Shadow},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: 'grn', _1: 'Grand Tortofist', _2: _user$project$Knight_UV$Normal},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: 'sav', _1: 'Savage Tortofist', _2: _user$project$Knight_UV$Piercing},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple3', _0: 'omg', _1: 'Omega Tortofist', _2: _user$project$Knight_UV$Elemental},
					_1: {ctor: '[]'}
				}
			}
		}
	};
	return A2(_elm_lang$core$List$map, copy, variants);
}();
var _user$project$Knight_Guns$mixmasters = function () {
	var copy = function (_p2) {
		var _p3 = _p2;
		return _elm_lang$core$Native_Utils.update(
			_user$project$Knight_Guns$gun,
			{
				id: _p3._0,
				name: _p3._1,
				damageType: _user$project$Knight_UV$Elemental,
				status: _elm_lang$core$Maybe$Just(_p3._2),
				attacks: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Values$attacks.driver},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.driverCharge},
						_1: {ctor: '[]'}
					}
				},
				inflictions: {
					ctor: '::',
					_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Shot, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Minor},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Moderate},
						_1: {ctor: '[]'}
					}
				}
			});
	};
	var variants = {
		ctor: '::',
		_0: {ctor: '_Tuple3', _0: 'omm', _1: 'Overcharged Mixmaster', _2: _user$project$Knight_Status$Shock},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: 'cog', _1: 'Celestial Orbitgun', _2: _user$project$Knight_Status$Fire},
			_1: {ctor: '[]'}
		}
	};
	return A2(_elm_lang$core$List$map, copy, variants);
}();
var _user$project$Knight_Guns$guns = A2(
	_elm_lang$core$Basics_ops['++'],
	{
		ctor: '::',
		_0: _user$project$Knight_Guns$valiance,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_Guns$rift,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Guns$arcana,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Guns$phant,
					_1: {ctor: '[]'}
				}
			}
		}
	},
	A2(
		_elm_lang$core$Basics_ops['++'],
		{
			ctor: '::',
			_0: _user$project$Knight_Guns$nova,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Guns$umbra,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Guns$magma,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Guns$storm,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Guns$cryo,
							_1: {ctor: '[]'}
						}
					}
				}
			}
		},
		A2(
			_elm_lang$core$Basics_ops['++'],
			{
				ctor: '::',
				_0: _user$project$Knight_Guns$blitz,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Guns$grim,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Guns$pepper,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Guns$plague,
							_1: {ctor: '[]'}
						}
					}
				}
			},
			A2(
				_elm_lang$core$Basics_ops['++'],
				{
					ctor: '::',
					_0: _user$project$Knight_Guns$slug,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Guns$cal,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Guns$wg,
							_1: {ctor: '[]'}
						}
					}
				},
				A2(
					_elm_lang$core$Basics_ops['++'],
					{
						ctor: '::',
						_0: _user$project$Knight_Guns$gg,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Guns$ap,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_Guns$sent,
								_1: {
									ctor: '::',
									_0: _user$project$Knight_Guns$obsidian,
									_1: {ctor: '[]'}
								}
							}
						}
					},
					A2(
						_elm_lang$core$Basics_ops['++'],
						{
							ctor: '::',
							_0: _user$project$Knight_Guns$supernova,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_Guns$polaris,
								_1: {
									ctor: '::',
									_0: _user$project$Knight_Guns$wildfire,
									_1: {
										ctor: '::',
										_0: _user$project$Knight_Guns$permafroster,
										_1: {ctor: '[]'}
									}
								}
							}
						},
						A2(
							_elm_lang$core$Basics_ops['++'],
							{
								ctor: '::',
								_0: _user$project$Knight_Guns$neutralizer,
								_1: {
									ctor: '::',
									_0: _user$project$Knight_Guns$biohazard,
									_1: {ctor: '[]'}
								}
							},
							A2(_elm_lang$core$Basics_ops['++'], _user$project$Knight_Guns$tortofists, _user$project$Knight_Guns$mixmasters))))))));

var _user$project$Knight_Bombs$bomb = {
	id: 'bomb',
	weaponType: _user$project$Knight_Types$Bomb,
	name: 'Stock Bomb',
	damageType: _user$project$Knight_UV$Normal,
	split: _elm_lang$core$Maybe$Nothing,
	status: _elm_lang$core$Maybe$Nothing,
	chargeTime: _user$project$Knight_Values$charge.normal,
	attacks: {ctor: '[]'},
	inflictions: {ctor: '[]'},
	bonuses: {ctor: '[]'}
};
var _user$project$Knight_Bombs$nitro = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$bomb,
	{
		id: 'ntr',
		name: 'Nitronome',
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.nitro},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Bombs$dbb = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$nitro,
	{id: 'dbb', name: 'Dark Briar Barrage', damageType: _user$project$Knight_UV$Piercing});
var _user$project$Knight_Bombs$irontech = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$bomb,
	{
		id: 'irn',
		name: 'Irontech Destroyer',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Stun),
		chargeTime: _user$project$Knight_Values$charge.irontech,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.irontech},
			_1: {ctor: '[]'}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Fair, _2: _user$project$Knight_Types$Minor},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Bombs$bab = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$irontech,
	{
		id: 'bab',
		name: 'Big Angry Bomb',
		chargeTime: _user$project$Knight_Values$charge.$long,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.bab},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Bombs$ash = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$bomb,
	{
		id: 'ash',
		name: 'Ash of Agni',
		damageType: _user$project$Knight_UV$Elemental,
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Fire),
		chargeTime: _user$project$Knight_Values$charge.$long,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.haze},
			_1: {ctor: '[]'}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Minor},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Bombs$shiver = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$ash,
	{
		id: 'shv',
		name: 'Shivermist Buster',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Freeze)
	});
var _user$project$Knight_Bombs$venom = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$ash,
	{
		id: 'vv',
		name: 'Venom Veiler',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Poison)
	});
var _user$project$Knight_Bombs$tempest = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$ash,
	{
		id: 'vt',
		name: 'Voltaic Tempest',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Shock)
	});
var _user$project$Knight_Bombs$stagger = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$ash,
	{
		id: 'stg',
		name: 'Stagger Storm',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Stun)
	});
var _user$project$Knight_Bombs$tantrum = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$ash,
	{
		id: 'tt',
		name: 'Torpor Tantrum',
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Sleep)
	});
var _user$project$Knight_Bombs$graviton = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$bomb,
	{
		id: 'grv',
		name: 'Graviton Vortex',
		damageType: _user$project$Knight_UV$Shadow,
		chargeTime: _user$project$Knight_Values$charge.$long,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.graviton},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.gravitonCollapse},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Bombs$vortexes = function () {
	var copy = function (_p0) {
		var _p1 = _p0;
		return _elm_lang$core$Native_Utils.update(
			_user$project$Knight_Bombs$bomb,
			{
				id: _p1._0,
				name: _p1._1,
				damageType: _p1._2,
				chargeTime: _user$project$Knight_Values$charge.$long,
				status: _elm_lang$core$Maybe$Just(_p1._3),
				attacks: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.graviton},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.haze},
						_1: {ctor: '[]'}
					}
				},
				inflictions: {
					ctor: '::',
					_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Strong},
					_1: {ctor: '[]'}
				}
			});
	};
	var variants = {
		ctor: '::',
		_0: {ctor: '_Tuple4', _0: 'ev', _1: 'Electron Vortex', _2: _user$project$Knight_UV$Elemental, _3: _user$project$Knight_Status$Shock},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple4', _0: 'ogr', _1: 'Obsidian Crusher', _2: _user$project$Knight_UV$Shadow, _3: _user$project$Knight_Status$Poison},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple4', _0: 'fgr', _1: 'Celestial Vortex', _2: _user$project$Knight_UV$Elemental, _3: _user$project$Knight_Status$Fire},
				_1: {ctor: '[]'}
			}
		}
	};
	return A2(_elm_lang$core$List$map, copy, variants);
}();
var _user$project$Knight_Bombs$dr = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$bomb,
	{
		id: 'dr',
		name: 'Dark Retribution',
		damageType: _user$project$Knight_UV$Shadow,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.dr},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Bombs$sss = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$bomb,
	{
		id: 'sun',
		name: 'Scintillating Sun Shards',
		damageType: _user$project$Knight_UV$Piercing,
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Stun),
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.shardCore},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.shardStatus},
				_1: {ctor: '[]'}
			}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Fair, _2: _user$project$Knight_Types$Moderate},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Types$Fair, _2: _user$project$Knight_Types$Moderate},
				_1: {ctor: '[]'}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Fiend, _1: _user$project$Knight_UV$VeryHigh},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Bombs$ssb = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$sss,
	{
		id: 'slt',
		name: 'Shocking Salt Bomb',
		damageType: _user$project$Knight_UV$Shadow,
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Shock),
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Slime, _1: _user$project$Knight_UV$VeryHigh},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Bombs$shards = function () {
	var copy = function (_p2) {
		var _p3 = _p2;
		return _elm_lang$core$Native_Utils.update(
			_user$project$Knight_Bombs$bomb,
			{
				id: _p3._0,
				name: _p3._1,
				damageType: _p3._2,
				attacks: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.shardCore},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Special, _1: _user$project$Knight_Values$attacks.shardPure},
						_1: {ctor: '[]'}
					}
				}
			});
	};
	var variants = {
		ctor: '::',
		_0: {ctor: '_Tuple3', _0: 'nshr', _1: 'Deadly Shard Bomb', _2: _user$project$Knight_UV$Normal},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: 'pshr', _1: 'Deadly Splinter Bomb', _2: _user$project$Knight_UV$Piercing},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple3', _0: 'eshr', _1: 'Deadly Crystal Bomb', _2: _user$project$Knight_UV$Elemental},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple3', _0: 'sshr', _1: 'Deadly Dark Matter Bomb', _2: _user$project$Knight_UV$Shadow},
					_1: {ctor: '[]'}
				}
			}
		}
	};
	return A2(_elm_lang$core$List$map, copy, variants);
}();
var _user$project$Knight_Bombs$rss = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$bomb,
	{
		id: 'rss',
		name: 'Radiant Sun Shards (Old)',
		damageType: _user$project$Knight_UV$Piercing,
		split: _elm_lang$core$Maybe$Just(_user$project$Knight_UV$Elemental),
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.shardOld},
			_1: {ctor: '[]'}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Fiend, _1: _user$project$Knight_UV$High},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Bombs$salt = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Bombs$bomb,
	{
		id: 'isb',
		name: 'Ionized Salt Bomb (Old)',
		damageType: _user$project$Knight_UV$Piercing,
		status: _elm_lang$core$Maybe$Just(_user$project$Knight_Status$Shock),
		chargeTime: _user$project$Knight_Values$charge.painful,
		attacks: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Values$attacks.saltOld},
			_1: {ctor: '[]'}
		},
		inflictions: {
			ctor: '::',
			_0: {ctor: '_Tuple3', _0: _user$project$Knight_Types$Charge, _1: _user$project$Knight_Types$Good, _2: _user$project$Knight_Types$Moderate},
			_1: {ctor: '[]'}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Slime, _1: _user$project$Knight_UV$High},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Bombs$bombs = A2(
	_elm_lang$core$Basics_ops['++'],
	{
		ctor: '::',
		_0: _user$project$Knight_Bombs$nitro,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_Bombs$irontech,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Bombs$bab,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Bombs$dbb,
					_1: {ctor: '[]'}
				}
			}
		}
	},
	A2(
		_elm_lang$core$Basics_ops['++'],
		{
			ctor: '::',
			_0: _user$project$Knight_Bombs$ash,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Bombs$shiver,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Bombs$venom,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Bombs$tempest,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Bombs$stagger,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_Bombs$tantrum,
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		},
		A2(
			_elm_lang$core$Basics_ops['++'],
			{ctor: '::', _0: _user$project$Knight_Bombs$graviton, _1: _user$project$Knight_Bombs$vortexes},
			A2(
				_elm_lang$core$Basics_ops['++'],
				{
					ctor: '::',
					_0: _user$project$Knight_Bombs$dr,
					_1: {ctor: '[]'}
				},
				A2(
					_elm_lang$core$Basics_ops['++'],
					{
						ctor: '::',
						_0: _user$project$Knight_Bombs$sss,
						_1: {ctor: '::', _0: _user$project$Knight_Bombs$ssb, _1: _user$project$Knight_Bombs$shards}
					},
					{
						ctor: '::',
						_0: _user$project$Knight_Bombs$rss,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Bombs$salt,
							_1: {ctor: '[]'}
						}
					})))));

var _user$project$Knight_Armour$base = {
	id: 'base',
	hearts: 5,
	name: 'Base Armour',
	defences: {
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: _user$project$Knight_UV$defences.base},
		_1: {ctor: '[]'}
	},
	resistances: {ctor: '[]'},
	bonuses: {ctor: '[]'}
};
var _user$project$Knight_Armour$class = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: _user$project$Knight_UV$defences.$class},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$plate = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$class,
	{
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: _user$project$Knight_UV$defences.plate},
			_1: {ctor: '[]'}
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Stun, _1: 4},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$ironmight = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$plate,
	{
		id: 'irn',
		name: 'Ironmight Plate',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Piercing, _1: _user$project$Knight_UV$defences.base},
			_1: _user$project$Knight_Armour$plate.defences
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$ASI, _1: _user$project$Knight_UV$NegLow},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$volcPlate = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$plate,
	{
		id: 'vpl',
		name: 'Volcanic Plate',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: _user$project$Knight_UV$defences.base},
			_1: _user$project$Knight_Armour$plate.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: 4},
			_1: _user$project$Knight_Armour$plate.resistances
		},
		bonuses: _user$project$Knight_Armour$ironmight.bonuses
	});
var _user$project$Knight_Armour$ancient = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$plate,
	{
		id: 'apl',
		name: 'Ancient Plate',
		hearts: 8,
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: _user$project$Knight_UV$defences.ancient},
			_1: {ctor: '[]'}
		},
		bonuses: A2(
			_elm_lang$core$Basics_ops['++'],
			_user$project$Knight_Armour$ironmight.bonuses,
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$MSI, _1: _user$project$Knight_UV$NegLow},
				_1: {ctor: '[]'}
			})
	});
var _user$project$Knight_Armour$skolver = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$class,
	{
		id: 'sko',
		name: 'Skolver',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Piercing, _1: _user$project$Knight_UV$defences.base},
			_1: _user$project$Knight_Armour$class.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: 4},
			_1: {ctor: '[]'}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordDmg, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$starlit = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$skolver,
	{
		id: 'sth',
		name: 'Starlit Hunting',
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Stun, _1: -4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Sleep, _1: 4},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$starDemo = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$starlit,
	{
		id: 'std',
		name: 'Starlit Demo',
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$BombCTR, _1: _user$project$Knight_UV$Medium},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Slime, _1: _user$project$Knight_UV$Low},
				_1: {ctor: '[]'}
			}
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Stun, _1: -4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Sleep, _1: 4},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$justifier = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$skolver,
	{
		id: 'jus',
		name: 'Justifier',
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Stun, _1: 4},
			_1: {ctor: '[]'}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$GunASI, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$vog = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$class,
	{
		id: 'vog',
		name: 'Vog Cub',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: _user$project$Knight_UV$defences.base},
			_1: _user$project$Knight_Armour$class.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: 4},
			_1: {ctor: '[]'}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordASI, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$nameless = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$vog,
	{
		id: 'name',
		name: 'Nameless',
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: 4},
			_1: {ctor: '[]'}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$GunASI, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$bombastic = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$nameless,
	{
		id: 'bmb',
		name: 'Bombastic Demo',
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$BombDmg, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$volcDemo = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$vog,
	{
		id: 'dem',
		name: 'Volcanic Demo',
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$BombCTR, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$mercDemo = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$volcDemo,
	{
		id: 'mdm',
		name: 'Mercurial Demo',
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: 4},
			_1: {ctor: '[]'}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$BombDmg, _1: _user$project$Knight_UV$Low},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$MSI, _1: _user$project$Knight_UV$Low},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$snarby = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$skolver,
	{
		id: 'snr',
		name: 'Snarbolax',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Shadow, _1: _user$project$Knight_UV$defences.base},
			_1: _user$project$Knight_Armour$class.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: 3},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: 3},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$shadowsun = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$snarby,
	{
		id: 'sun',
		name: 'Shadowsun',
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: 4},
			_1: {ctor: '[]'}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$GunDmg, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$deadshot = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$shadowsun,
	{
		id: 'ded',
		name: 'Deadshot',
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: 4},
			_1: {ctor: '[]'}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$GunASI, _1: _user$project$Knight_UV$Low},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Undead, _1: _user$project$Knight_UV$Low},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$cobalt = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'azr',
		name: 'Azure Guardian',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Piercing, _1: _user$project$Knight_UV$defences.base},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: _user$project$Knight_UV$defences.special},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$crusader = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'alm',
		name: 'Almirian Crusader',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Shadow, _1: _user$project$Knight_UV$defences.base},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: _user$project$Knight_UV$defences.special},
				_1: {ctor: '[]'}
			}
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: -2},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: 2},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$mad = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'mad',
		name: 'Mad Bomber',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: _user$project$Knight_UV$defences.base},
			_1: _user$project$Knight_Armour$base.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: -2},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: -2},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: -2},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: -2},
						_1: {ctor: '[]'}
					}
				}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$BombDmg, _1: _user$project$Knight_UV$Medium},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$BombCTR, _1: _user$project$Knight_UV$Medium},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$chaos = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$mad,
	{
		id: 'cha',
		name: 'Chaos',
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: -2},
			_1: _user$project$Knight_Armour$mad.resistances
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Dmg, _1: _user$project$Knight_UV$Medium},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$CTR, _1: _user$project$Knight_UV$Medium},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$jelly = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'jel',
		name: 'Royal Jelly',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Piercing, _1: _user$project$Knight_UV$defences.special},
			_1: _user$project$Knight_Armour$base.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Stun, _1: 4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Sleep, _1: 4},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$merc = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$jelly,
	{
		id: 'mrc',
		name: 'Mercurial Jelly',
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: 4},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$queen = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$jelly,
	{
		id: 'iq',
		name: 'Ice Queen',
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Stun, _1: 4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: 4},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$gray = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'gry',
		name: 'Gray Feather',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: _user$project$Knight_UV$defences.special},
			_1: _user$project$Knight_Armour$base.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: 4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: 4},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$divine = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'div',
		name: 'Divine',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: _user$project$Knight_UV$defences.$class},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Shadow, _1: _user$project$Knight_UV$defences.$class},
				_1: {ctor: '[]'}
			}
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: 4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: 4},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: 4},
					_1: {ctor: '[]'}
				}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Fiend, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$skelly = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'skl',
		name: 'Dread Skelly',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Shadow, _1: _user$project$Knight_UV$defences.special},
			_1: _user$project$Knight_Armour$base.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: 4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: 4},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$kat = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'kat',
		name: 'Black Kat',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Shadow, _1: _user$project$Knight_UV$defences.base},
			_1: _user$project$Knight_Armour$base.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: 4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: -2},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: -2},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: -2},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: -4},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Dmg, _1: _user$project$Knight_UV$High},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$MSI, _1: _user$project$Knight_UV$Low},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$claw = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'cla',
		name: 'Kat Claw',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Shadow, _1: _user$project$Knight_UV$defences.special},
			_1: _user$project$Knight_Armour$base.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: 4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: -2},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: -1},
					_1: {ctor: '[]'}
				}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordDmg, _1: _user$project$Knight_UV$Low},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordASI, _1: _user$project$Knight_UV$Low},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$eye = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$claw,
	{
		id: 'eye',
		name: 'Kat Eye',
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$GunDmg, _1: _user$project$Knight_UV$Low},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$GunASI, _1: _user$project$Knight_UV$Low},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$hiss = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$claw,
	{
		id: 'his',
		name: 'Kat Hiss',
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$BombDmg, _1: _user$project$Knight_UV$Low},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$BombCTR, _1: _user$project$Knight_UV$Low},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$seerus = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'pms',
		name: 'Perfect Mask of Seerus',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: _user$project$Knight_UV$defences.$class},
			_1: _user$project$Knight_Armour$class.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: 4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: -2},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: 4},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: -2},
						_1: {ctor: '[]'}
					}
				}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$GunCTR, _1: _user$project$Knight_UV$Medium},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$GunASI, _1: _user$project$Knight_UV$Low},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$valkyrie = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'vlk',
		name: 'Valkyrie',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Shadow, _1: _user$project$Knight_UV$defences.base},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: _user$project$Knight_UV$defences.base},
				_1: {ctor: '[]'}
			}
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: -4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: 4},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: 4},
					_1: {ctor: '[]'}
				}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Fiend, _1: _user$project$Knight_UV$Low},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$fallen = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$valkyrie,
	{
		id: 'fal',
		name: 'Fallen',
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: 4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: 4},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: -4},
					_1: {ctor: '[]'}
				}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Fiend, _1: _user$project$Knight_UV$NegLow},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$ASI, _1: _user$project$Knight_UV$Low},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$heavenly = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'hvn',
		name: 'Heavenly Iron',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Shadow, _1: _user$project$Knight_UV$defences.base},
			_1: _user$project$Knight_Armour$class.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: -4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: 4},
				_1: {ctor: '[]'}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Fiend, _1: _user$project$Knight_UV$Low},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordDmg, _1: _user$project$Knight_UV$Low},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$virulisk = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'vir',
		name: 'Deadly Virulisk',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Piercing, _1: _user$project$Knight_UV$defences.base},
			_1: _user$project$Knight_Armour$class.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: 4},
			_1: {ctor: '[]'}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Slime, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$salamander = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$virulisk,
	{
		id: 'sal',
		name: 'Volcanic Salamander',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: _user$project$Knight_UV$defences.base},
			_1: _user$project$Knight_Armour$class.defences
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: 4},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$arcane = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$salamander,
	{
		id: 'arc',
		name: 'Arcane Salamander',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: _user$project$Knight_UV$defences.$class},
			_1: _user$project$Knight_Armour$class.defences
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Slime, _1: _user$project$Knight_UV$Low},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Beast, _1: _user$project$Knight_UV$Low},
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Knight_Armour$dragon = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'scl',
		name: 'Dragon Scale',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Piercing, _1: _user$project$Knight_UV$defences.$class},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: _user$project$Knight_UV$defences.$class},
				_1: {ctor: '[]'}
			}
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: 4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: 4},
				_1: {ctor: '[]'}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Beast, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$silver = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'slv',
		name: 'Radiant Silvermail',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Piercing, _1: _user$project$Knight_UV$defences.$class},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Shadow, _1: _user$project$Knight_UV$defences.$class},
				_1: {ctor: '[]'}
			}
		},
		resistances: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: 4},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: 4},
				_1: {ctor: '[]'}
			}
		},
		bonuses: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Undead, _1: _user$project$Knight_UV$Medium},
			_1: {ctor: '[]'}
		}
	});
var _user$project$Knight_Armour$vitasuit = _elm_lang$core$Native_Utils.update(
	_user$project$Knight_Armour$base,
	{
		id: 'vit',
		name: 'Vitasuit Deluxe',
		defences: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: _user$project$Knight_UV$defences.vita},
			_1: {ctor: '[]'}
		},
		hearts: 7
	});
var _user$project$Knight_Armour$gunnerSets = function () {
	var damageTypes = {
		ctor: '::',
		_0: _user$project$Knight_UV$Piercing,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$Elemental,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$Shadow,
				_1: {ctor: '[]'}
			}
		}
	};
	var statuses = {
		ctor: '::',
		_0: _user$project$Knight_Status$Fire,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_Status$Shock,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Status$Freeze,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Status$Poison,
					_1: {ctor: '[]'}
				}
			}
		}
	};
	var defenceName = function (dType) {
		var _p0 = dType;
		switch (_p0.ctor) {
			case 'Piercing':
				return 'Pathfinder';
			case 'Elemental':
				return 'Sentinel';
			case 'Shadow':
				return 'Shade';
			default:
				return 'WAT?';
		}
	};
	var familyName = F2(
		function (bonus, defence) {
			var _p1 = _elm_lang$core$Tuple$first(bonus);
			switch (_p1.ctor) {
				case 'Beast':
					return 'Guerilla';
				case 'Slime':
					return 'Hazard';
				case 'Undead':
					return 'Ghost';
				case 'Fiend':
					return 'Hex';
				case 'Gremlin':
					return 'Wraith';
				case 'Construct':
					return 'Keeper';
				default:
					return defenceName(defence);
			}
		});
	var families = function (dType) {
		var _p2 = dType;
		switch (_p2.ctor) {
			case 'Piercing':
				return {
					ctor: '::',
					_0: _user$project$Knight_UV$Slime,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$Beast,
						_1: {ctor: '[]'}
					}
				};
			case 'Elemental':
				return {
					ctor: '::',
					_0: _user$project$Knight_UV$Construct,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$Gremlin,
						_1: {ctor: '[]'}
					}
				};
			case 'Shadow':
				return {
					ctor: '::',
					_0: _user$project$Knight_UV$Undead,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$Fiend,
						_1: {ctor: '[]'}
					}
				};
			default:
				return {
					ctor: '::',
					_0: _user$project$Knight_UV$BombDmg,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$BombCTR,
						_1: {ctor: '[]'}
					}
				};
		}
	};
	var toBonus = function (family) {
		return {ctor: '_Tuple2', _0: family, _1: _user$project$Knight_UV$Medium};
	};
	var counter = function (status) {
		var _p3 = status;
		switch (_p3.ctor) {
			case 'Fire':
				return _user$project$Knight_Status$Shock;
			case 'Shock':
				return _user$project$Knight_Status$Freeze;
			case 'Freeze':
				return _user$project$Knight_Status$Poison;
			case 'Poison':
				return _user$project$Knight_Status$Fire;
			default:
				return status;
		}
	};
	var statusName = function (status) {
		var _p4 = status;
		switch (_p4.ctor) {
			case 'Fire':
				return 'Firefly';
			case 'Shock':
				return 'Falcon';
			case 'Freeze':
				return 'Grizzly';
			case 'Poison':
				return 'Snakebite';
			default:
				return _elm_lang$core$Basics$toString(status);
		}
	};
	var compose = F3(
		function (defence, bonus, status) {
			return _elm_lang$core$Native_Utils.update(
				_user$project$Knight_Armour$base,
				{
					id: _elm_lang$core$String$toLower(
						A2(
							_elm_lang$core$String$join,
							'',
							{
								ctor: '::',
								_0: 'gun',
								_1: {
									ctor: '::',
									_0: A3(
										_elm_lang$core$String$slice,
										0,
										1,
										_elm_lang$core$Basics$toString(defence)),
									_1: {
										ctor: '::',
										_0: A3(
											_elm_lang$core$String$slice,
											0,
											2,
											_elm_lang$core$Basics$toString(status)),
										_1: {
											ctor: '::',
											_0: A3(
												_elm_lang$core$String$slice,
												0,
												2,
												_elm_lang$core$Basics$toString(
													_elm_lang$core$Tuple$first(bonus))),
											_1: {ctor: '[]'}
										}
									}
								}
							})),
					name: A2(
						_elm_lang$core$String$join,
						' ',
						{
							ctor: '::',
							_0: 'Sacred',
							_1: {
								ctor: '::',
								_0: statusName(status),
								_1: {
									ctor: '::',
									_0: A2(familyName, bonus, defence),
									_1: {ctor: '[]'}
								}
							}
						}),
					defences: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: defence, _1: _user$project$Knight_UV$defences.base},
						_1: _user$project$Knight_Armour$base.defences
					},
					resistances: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: status, _1: 4},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: counter(status),
								_1: -3
							},
							_1: {ctor: '[]'}
						}
					},
					bonuses: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$GunCTR, _1: _user$project$Knight_UV$Low},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$GunASI, _1: _user$project$Knight_UV$Low},
							_1: {
								ctor: '::',
								_0: bonus,
								_1: {ctor: '[]'}
							}
						}
					}
				});
		});
	var statusPaths = F2(
		function (defence, bonus) {
			return A2(
				_elm_lang$core$List$map,
				A2(compose, defence, bonus),
				statuses);
		});
	var familyPaths = function (defence) {
		var bonuses = {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$GunDmg, _1: _user$project$Knight_UV$Low},
			_1: A2(
				_elm_lang$core$List$map,
				toBonus,
				families(defence))
		};
		return A2(
			_elm_lang$core$List$concatMap,
			statusPaths(defence),
			bonuses);
	};
	return A2(_elm_lang$core$List$concatMap, familyPaths, damageTypes);
}();
var _user$project$Knight_Armour$armours = A2(
	_elm_lang$core$Basics_ops['++'],
	{
		ctor: '::',
		_0: _user$project$Knight_Armour$cobalt,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_Armour$crusader,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Armour$skolver,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Armour$vog,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Armour$snarby,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Armour$starlit,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_Armour$justifier,
								_1: {
									ctor: '::',
									_0: _user$project$Knight_Armour$nameless,
									_1: {
										ctor: '::',
										_0: _user$project$Knight_Armour$shadowsun,
										_1: {
											ctor: '::',
											_0: _user$project$Knight_Armour$deadshot,
											_1: {
												ctor: '::',
												_0: _user$project$Knight_Armour$volcDemo,
												_1: {
													ctor: '::',
													_0: _user$project$Knight_Armour$bombastic,
													_1: {
														ctor: '::',
														_0: _user$project$Knight_Armour$mad,
														_1: {
															ctor: '::',
															_0: _user$project$Knight_Armour$mercDemo,
															_1: {
																ctor: '::',
																_0: _user$project$Knight_Armour$starDemo,
																_1: {
																	ctor: '::',
																	_0: _user$project$Knight_Armour$jelly,
																	_1: {
																		ctor: '::',
																		_0: _user$project$Knight_Armour$queen,
																		_1: {
																			ctor: '::',
																			_0: _user$project$Knight_Armour$merc,
																			_1: {
																				ctor: '::',
																				_0: _user$project$Knight_Armour$gray,
																				_1: {
																					ctor: '::',
																					_0: _user$project$Knight_Armour$divine,
																					_1: {
																						ctor: '::',
																						_0: _user$project$Knight_Armour$chaos,
																						_1: {
																							ctor: '::',
																							_0: _user$project$Knight_Armour$skelly,
																							_1: {
																								ctor: '::',
																								_0: _user$project$Knight_Armour$ironmight,
																								_1: {
																									ctor: '::',
																									_0: _user$project$Knight_Armour$volcPlate,
																									_1: {
																										ctor: '::',
																										_0: _user$project$Knight_Armour$ancient,
																										_1: {
																											ctor: '::',
																											_0: _user$project$Knight_Armour$virulisk,
																											_1: {
																												ctor: '::',
																												_0: _user$project$Knight_Armour$salamander,
																												_1: {
																													ctor: '::',
																													_0: _user$project$Knight_Armour$arcane,
																													_1: {
																														ctor: '::',
																														_0: _user$project$Knight_Armour$dragon,
																														_1: {
																															ctor: '::',
																															_0: _user$project$Knight_Armour$silver,
																															_1: {
																																ctor: '::',
																																_0: _user$project$Knight_Armour$valkyrie,
																																_1: {
																																	ctor: '::',
																																	_0: _user$project$Knight_Armour$fallen,
																																	_1: {
																																		ctor: '::',
																																		_0: _user$project$Knight_Armour$heavenly,
																																		_1: {
																																			ctor: '::',
																																			_0: _user$project$Knight_Armour$kat,
																																			_1: {
																																				ctor: '::',
																																				_0: _user$project$Knight_Armour$claw,
																																				_1: {
																																					ctor: '::',
																																					_0: _user$project$Knight_Armour$eye,
																																					_1: {
																																						ctor: '::',
																																						_0: _user$project$Knight_Armour$hiss,
																																						_1: {
																																							ctor: '::',
																																							_0: _user$project$Knight_Armour$seerus,
																																							_1: {
																																								ctor: '::',
																																								_0: _user$project$Knight_Armour$vitasuit,
																																								_1: {ctor: '[]'}
																																							}
																																						}
																																					}
																																				}
																																			}
																																		}
																																	}
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},
	_user$project$Knight_Armour$gunnerSets);

var _user$project$Knight_Shield$guardian = function () {
	var composeStatus = function (status) {
		return _user$project$Knight_UV$StatusUV(
			{ctor: '_Tuple2', _0: status, _1: _user$project$Knight_UV$Medium});
	};
	var statuses = A2(
		_elm_lang$core$List$map,
		composeStatus,
		{
			ctor: '::',
			_0: _user$project$Knight_Status$Fire,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Status$Freeze,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Status$Shock,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Status$Poison,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Status$Stun,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_Status$Curse,
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		});
	return {
		id: 'gua',
		name: 'Guardian Shield',
		effects: A2(
			_elm_lang$core$Basics_ops['++'],
			{
				ctor: '::',
				_0: _user$project$Knight_UV$Hearts(12),
				_1: {
					ctor: '::',
					_0: _user$project$Knight_UV$WeaponUV(
						{ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordASI, _1: _user$project$Knight_UV$Low}),
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$WeaponUV(
							{ctor: '_Tuple2', _0: _user$project$Knight_UV$BombCTR, _1: _user$project$Knight_UV$Low}),
						_1: {
							ctor: '::',
							_0: _user$project$Knight_UV$WeaponUV(
								{ctor: '_Tuple2', _0: _user$project$Knight_UV$GunASI, _1: _user$project$Knight_UV$NegLow}),
							_1: {ctor: '[]'}
						}
					}
				}
			},
			statuses)
	};
}();
var _user$project$Knight_Shield$recon = {
	id: 'rec',
	name: 'Recon Cloak',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$Hearts(10),
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$WeaponUV(
				{ctor: '_Tuple2', _0: _user$project$Knight_UV$CTR, _1: _user$project$Knight_UV$Medium}),
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$WeaponUV(
					{ctor: '_Tuple2', _0: _user$project$Knight_UV$GunASI, _1: _user$project$Knight_UV$Medium}),
				_1: {
					ctor: '::',
					_0: _user$project$Knight_UV$WeaponUV(
						{ctor: '_Tuple2', _0: _user$project$Knight_UV$BombCTR, _1: _user$project$Knight_UV$Medium}),
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$WeaponUV(
							{ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordASI, _1: _user$project$Knight_UV$NegLow}),
						_1: {ctor: '[]'}
					}
				}
			}
		}
	}
};
var _user$project$Knight_Shield$striker = {
	id: 'str',
	name: 'Strike Booster',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordDmg, _1: _user$project$Knight_UV$Medium}),
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$WeaponUV(
				{ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordASI, _1: _user$project$Knight_UV$Medium}),
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$WeaponUV(
					{ctor: '_Tuple2', _0: _user$project$Knight_UV$BombCTR, _1: _user$project$Knight_UV$NegVeryHigh}),
				_1: {ctor: '[]'}
			}
		}
	}
};
var _user$project$Knight_Shield$gorgo = {
	id: 'grg',
	name: 'Gorgomega',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$MSI, _1: _user$project$Knight_UV$NegLow}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Shield$scarlet = {
	id: 'hp',
	name: 'Scarlet Shield',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$Hearts(2),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Shield$ssb = {
	id: 'ssb',
	name: 'SwiftStrike Buckler',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$ASI, _1: _user$project$Knight_UV$High}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Shield$bts = {
	id: 'bts',
	name: 'Barbarous Thorn Shield',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordDmg, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Shield$aegis = {
	id: 'aeg',
	name: 'Omega Shell',
	effects: {ctor: '[]'}
};
var _user$project$Knight_Shield$shields = {
	ctor: '::',
	_0: _user$project$Knight_Shield$striker,
	_1: {
		ctor: '::',
		_0: _user$project$Knight_Shield$recon,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_Shield$guardian,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Shield$bts,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Shield$ssb,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Shield$scarlet,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Shield$gorgo,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_Shield$aegis,
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		}
	}
};

var _user$project$Knight_Trinket$note = {
	id: 'note',
	name: 'Misplaced Promissory Note',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$DefenceUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: _user$project$Knight_UV$High}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$daybreaker = {
	id: 'dayb',
	name: 'Daybreaker Band',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$Hearts(1),
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$StatusUV(
				{ctor: '_Tuple2', _0: _user$project$Knight_Status$Sleep, _1: _user$project$Knight_UV$Low}),
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$WeaponUV(
					{ctor: '_Tuple2', _0: _user$project$Knight_UV$CTR, _1: _user$project$Knight_UV$Low}),
				_1: {
					ctor: '::',
					_0: _user$project$Knight_UV$WeaponUV(
						{ctor: '_Tuple2', _0: _user$project$Knight_UV$Slime, _1: _user$project$Knight_UV$Low}),
					_1: {ctor: '[]'}
				}
			}
		}
	}
};
var _user$project$Knight_Trinket$somna = {
	id: 'somna',
	name: 'Somnabulist\'s Totem',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$Hearts(4),
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$StatusUV(
				{ctor: '_Tuple2', _0: _user$project$Knight_Status$Sleep, _1: _user$project$Knight_UV$Low}),
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$WeaponUV(
					{ctor: '_Tuple2', _0: _user$project$Knight_UV$MSI, _1: _user$project$Knight_UV$Low}),
				_1: {ctor: '[]'}
			}
		}
	}
};
var _user$project$Knight_Trinket$solstice = {
	id: 'sol',
	name: 'Grand Solstice Ring',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$Hearts(4),
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$StatusUV(
				{ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: _user$project$Knight_UV$Low}),
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$StatusUV(
					{ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: _user$project$Knight_UV$Low}),
				_1: {ctor: '[]'}
			}
		}
	}
};
var _user$project$Knight_Trinket$autumn = {
	id: 'autumn',
	name: 'Gift of Autumn',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$Hearts(4),
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$StatusUV(
				{ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: _user$project$Knight_UV$Low}),
			_1: {ctor: '[]'}
		}
	}
};
var _user$project$Knight_Trinket$slash = {
	id: 'sdmg',
	name: 'Elite Slash Module',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordDmg, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$strike = {
	id: 'sasi',
	name: 'Elite Quick Strike Module',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordASI, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$sword = {
	id: 'sctr',
	name: 'Elite Sword Focus Module',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$SwordCTR, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$trueshot = {
	id: 'gdmg',
	name: 'Elite Trueshot Module',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$GunDmg, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$draw = {
	id: 'gasi',
	name: 'Elite Quick Draw Module',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$GunASI, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$handgun = {
	id: 'gctr',
	name: 'Elite Handgun Focus Module',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$GunCTR, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$boom = {
	id: 'bdmg',
	name: 'Elite Boom Module',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$BombDmg, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$bomb = {
	id: 'bctr',
	name: 'Elite Bomb Focus Module',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$BombCTR, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$penta = {
	id: 'hp',
	name: 'Penta-Heart Pendant',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$Hearts(6),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$katnip = {
	id: 'nip',
	name: 'Purrfect Katnip Pouch',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$StatusUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_Status$Sleep, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$amulet = {
	id: 'cur',
	name: 'Saintly Silver Amulet',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$StatusUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$laurel = {
	id: 'psn',
	name: 'Pure White Laurel',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$StatusUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$wyrmwood = {
	id: 'shk',
	name: 'Wyrmwood Bracelet',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$StatusUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$hearthstone = {
	id: 'fir',
	name: 'Sizzling Hearthstone Pendant',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$StatusUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$wetstone = {
	id: 'frz',
	name: 'Soaking Wetstone Pendant',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$StatusUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: _user$project$Knight_UV$Medium}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$skelly = {
	id: 'sha',
	name: 'Dread Skelly Charm',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$DefenceUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$Shadow, _1: _user$project$Knight_UV$High}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$crystal = {
	id: 'ele',
	name: 'Radiant Crystal Pin',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$DefenceUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: _user$project$Knight_UV$High}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$jelly = {
	id: 'prc',
	name: 'Royal Jelly Band',
	effects: {
		ctor: '::',
		_0: _user$project$Knight_UV$DefenceUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$Piercing, _1: _user$project$Knight_UV$High}),
		_1: {ctor: '[]'}
	}
};
var _user$project$Knight_Trinket$trinkets = {
	ctor: '::',
	_0: _user$project$Knight_Trinket$penta,
	_1: {
		ctor: '::',
		_0: _user$project$Knight_Trinket$slash,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_Trinket$strike,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Trinket$sword,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Trinket$trueshot,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Trinket$draw,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Trinket$handgun,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_Trinket$boom,
								_1: {
									ctor: '::',
									_0: _user$project$Knight_Trinket$bomb,
									_1: {
										ctor: '::',
										_0: _user$project$Knight_Trinket$wetstone,
										_1: {
											ctor: '::',
											_0: _user$project$Knight_Trinket$hearthstone,
											_1: {
												ctor: '::',
												_0: _user$project$Knight_Trinket$wyrmwood,
												_1: {
													ctor: '::',
													_0: _user$project$Knight_Trinket$laurel,
													_1: {
														ctor: '::',
														_0: _user$project$Knight_Trinket$jelly,
														_1: {
															ctor: '::',
															_0: _user$project$Knight_Trinket$crystal,
															_1: {
																ctor: '::',
																_0: _user$project$Knight_Trinket$skelly,
																_1: {
																	ctor: '::',
																	_0: _user$project$Knight_Trinket$note,
																	_1: {
																		ctor: '::',
																		_0: _user$project$Knight_Trinket$autumn,
																		_1: {
																			ctor: '::',
																			_0: _user$project$Knight_Trinket$solstice,
																			_1: {
																				ctor: '::',
																				_0: _user$project$Knight_Trinket$daybreaker,
																				_1: {
																					ctor: '::',
																					_0: _user$project$Knight_Trinket$somna,
																					_1: {ctor: '[]'}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Knight_Trinket$effects = function (trinkets) {
	return A2(
		_elm_lang$core$List$concatMap,
		function (_) {
			return _.effects;
		},
		trinkets);
};
var _user$project$Knight_Trinket$hearts = function (trinkets) {
	var toHearts = function (trinket) {
		return A2(_elm_lang$core$List$map, _user$project$Knight_UV$toHearts, trinket.effects);
	};
	return _elm_lang$core$List$sum(
		A2(_elm_lang$core$List$concatMap, toHearts, trinkets));
};

var _user$project$Knight$p2wKat = {
	piece: _user$project$Knight_Armour$kat,
	uvs: {
		ctor: '::',
		_0: _user$project$Knight_UV$DefenceUV(
			{ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: _user$project$Knight_UV$Maximum}),
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$StatusUV(
				{ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: _user$project$Knight_UV$Maximum}),
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$StatusUV(
					{ctor: '_Tuple2', _0: _user$project$Knight_Status$Stun, _1: _user$project$Knight_UV$Maximum}),
				_1: {ctor: '[]'}
			}
		}
	}
};
var _user$project$Knight$opponent = {
	name: 'Challenger',
	weapons: {
		ctor: '::',
		_0: {
			piece: _user$project$Knight_Swords$combuster,
			uvs: {
				ctor: '::',
				_0: _user$project$Knight_UV$WeaponUV(
					{ctor: '_Tuple2', _0: _user$project$Knight_UV$ASI, _1: _user$project$Knight_UV$VeryHigh}),
				_1: {
					ctor: '::',
					_0: _user$project$Knight_UV$WeaponUV(
						{ctor: '_Tuple2', _0: _user$project$Knight_UV$CTR, _1: _user$project$Knight_UV$VeryHigh}),
					_1: {ctor: '[]'}
				}
			}
		},
		_1: {
			ctor: '::',
			_0: {
				piece: _user$project$Knight_Guns$polaris,
				uvs: {
					ctor: '::',
					_0: _user$project$Knight_UV$WeaponUV(
						{ctor: '_Tuple2', _0: _user$project$Knight_UV$ASI, _1: _user$project$Knight_UV$VeryHigh}),
					_1: {ctor: '[]'}
				}
			},
			_1: {
				ctor: '::',
				_0: {
					piece: _user$project$Knight_Swords$faust,
					uvs: {
						ctor: '::',
						_0: _user$project$Knight_UV$WeaponUV(
							{ctor: '_Tuple2', _0: _user$project$Knight_UV$ASI, _1: _user$project$Knight_UV$VeryHigh}),
						_1: {ctor: '[]'}
					}
				},
				_1: {
					ctor: '::',
					_0: {
						piece: _user$project$Knight_Guns$arcana,
						uvs: {
							ctor: '::',
							_0: _user$project$Knight_UV$WeaponUV(
								{ctor: '_Tuple2', _0: _user$project$Knight_UV$ASI, _1: _user$project$Knight_UV$VeryHigh}),
							_1: {ctor: '[]'}
						}
					},
					_1: {ctor: '[]'}
				}
			}
		}
	},
	shield: {
		piece: _user$project$Knight_Shield$striker,
		uvs: {ctor: '[]'}
	},
	helmet: _user$project$Knight$p2wKat,
	armour: _user$project$Knight$p2wKat,
	trinkets: A2(_elm_lang$core$List$repeat, 2, _user$project$Knight_Trinket$penta),
	vita: 16
};
var _user$project$Knight$stockArmour = {
	piece: _user$project$Knight_Armour$cobalt,
	uvs: {ctor: '[]'}
};
var _user$project$Knight$you = {
	name: 'You',
	weapons: {
		ctor: '::',
		_0: {
			piece: _user$project$Knight_Swords$leviathan,
			uvs: {ctor: '[]'}
		},
		_1: {
			ctor: '::',
			_0: {
				piece: _user$project$Knight_Guns$valiance,
				uvs: {ctor: '[]'}
			},
			_1: {ctor: '[]'}
		}
	},
	shield: {
		piece: _user$project$Knight_Shield$recon,
		uvs: {ctor: '[]'}
	},
	helmet: _user$project$Knight$stockArmour,
	armour: _user$project$Knight$stockArmour,
	trinkets: {ctor: '[]'},
	vita: 0
};
var _user$project$Knight$toDamageBoost = function (uv) {
	var _p0 = uv;
	if ((_p0.ctor === 'WeaponUV') && (_p0._0.ctor === '_Tuple2')) {
		return {
			ctor: '_Tuple2',
			_0: _p0._0._0,
			_1: _user$project$Knight_UV$toDamageBonus(_p0._0._1)
		};
	} else {
		return {ctor: '_Tuple2', _0: _user$project$Knight_UV$Dmg, _1: 0};
	}
};
var _user$project$Knight$toResistance = function (uv) {
	var _p1 = uv;
	if ((_p1.ctor === 'StatusUV') && (_p1._0.ctor === '_Tuple2')) {
		return {
			ctor: '_Tuple2',
			_0: _p1._0._0,
			_1: _user$project$Knight_UV$toResistance(_p1._0._1)
		};
	} else {
		return {ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: 0};
	}
};
var _user$project$Knight$toDefence = function (uv) {
	var _p2 = uv;
	if ((_p2.ctor === 'DefenceUV') && (_p2._0.ctor === '_Tuple2')) {
		return {
			ctor: '_Tuple2',
			_0: _p2._0._0,
			_1: _user$project$Knight_UV$toDefence(_p2._0._1)
		};
	} else {
		return {ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: 0};
	}
};
var _user$project$Knight$secondTo = F2(
	function (x, y) {
		return {ctor: '_Tuple2', _0: x, _1: y};
	});
var _user$project$Knight$nonZero = function (x) {
	return !_elm_lang$core$Native_Utils.eq(
		0,
		_elm_lang$core$Tuple$second(x));
};
var _user$project$Knight$isType = F2(
	function (x, y) {
		return _elm_lang$core$Native_Utils.eq(
			x,
			_elm_lang$core$Tuple$first(y));
	});
var _user$project$Knight$sum = A2(
	_elm_lang$core$List$foldr,
	F2(
		function (x, y) {
			return x + y;
		}),
	0);
var _user$project$Knight$mobility = function (knight) {
	var uvs = A2(
		_elm_lang$core$Basics_ops['++'],
		{ctor: '[]'},
		A2(
			_elm_lang$core$Basics_ops['++'],
			knight.shield.piece.effects,
			_user$project$Knight_Trinket$effects(knight.trinkets)));
	var toBonus = function (uv) {
		var _p3 = uv;
		if ((_p3.ctor === 'WeaponUV') && (_p3._0.ctor === '_Tuple2')) {
			return {ctor: '_Tuple2', _0: _p3._0._0, _1: _p3._0._1};
		} else {
			return {ctor: '_Tuple2', _0: _user$project$Knight_UV$Dmg, _1: _user$project$Knight_UV$Low};
		}
	};
	var bonuses = _elm_lang$core$List$concat(
		{
			ctor: '::',
			_0: knight.helmet.piece.bonuses,
			_1: {
				ctor: '::',
				_0: knight.armour.piece.bonuses,
				_1: {
					ctor: '::',
					_0: A2(_elm_lang$core$List$map, toBonus, knight.shield.piece.effects),
					_1: {
						ctor: '::',
						_0: A2(_elm_lang$core$List$map, toBonus, uvs),
						_1: {ctor: '[]'}
					}
				}
			}
		});
	var boost = _user$project$Knight$sum(
		A2(
			_elm_lang$core$List$map,
			_user$project$Knight_UV$toDamageBonus,
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$second,
				A2(
					_elm_lang$core$List$filter,
					function (_p4) {
						var _p5 = _p4;
						return _elm_lang$core$Native_Utils.eq(_p5._0, _user$project$Knight_UV$MSI);
					},
					bonuses))));
	return 100 + boost;
};
var _user$project$Knight$attackSpeed = F2(
	function (knight, weapon) {
		var uvs = A2(
			_elm_lang$core$Basics_ops['++'],
			{ctor: '[]'},
			A2(
				_elm_lang$core$Basics_ops['++'],
				knight.shield.piece.effects,
				A2(
					_elm_lang$core$Basics_ops['++'],
					weapon.uvs,
					_user$project$Knight_Trinket$effects(knight.trinkets))));
		var bonusType = function () {
			var _p6 = weapon.piece.weaponType;
			switch (_p6.ctor) {
				case 'Sword':
					return _user$project$Knight_UV$SwordASI;
				case 'Gun':
					return _user$project$Knight_UV$GunASI;
				default:
					return _user$project$Knight_UV$ASI;
			}
		}();
		var toBonus = function (uv) {
			var _p7 = uv;
			if ((_p7.ctor === 'WeaponUV') && (_p7._0.ctor === '_Tuple2')) {
				return {ctor: '_Tuple2', _0: _p7._0._0, _1: _p7._0._1};
			} else {
				return {ctor: '_Tuple2', _0: _user$project$Knight_UV$Dmg, _1: _user$project$Knight_UV$Low};
			}
		};
		var bonuses = _elm_lang$core$List$concat(
			{
				ctor: '::',
				_0: knight.helmet.piece.bonuses,
				_1: {
					ctor: '::',
					_0: knight.armour.piece.bonuses,
					_1: {
						ctor: '::',
						_0: A2(_elm_lang$core$List$map, toBonus, uvs),
						_1: {ctor: '[]'}
					}
				}
			});
		var boost = A2(
			_elm_lang$core$Basics$min,
			24,
			_user$project$Knight$sum(
				A2(
					_elm_lang$core$List$map,
					_user$project$Knight_UV$toDamageBonus,
					A2(
						_elm_lang$core$List$map,
						_elm_lang$core$Tuple$second,
						A2(
							_elm_lang$core$List$filter,
							function (_p8) {
								var _p9 = _p8;
								var _p10 = _p9._0;
								return _elm_lang$core$Native_Utils.eq(_p10, _user$project$Knight_UV$ASI) || _elm_lang$core$Native_Utils.eq(_p10, bonusType);
							},
							bonuses)))));
		return 100 + boost;
	});
var _user$project$Knight$chargeSpeed = F2(
	function (knight, weapon) {
		var uvs = A2(
			_elm_lang$core$Basics_ops['++'],
			{ctor: '[]'},
			A2(
				_elm_lang$core$Basics_ops['++'],
				knight.shield.piece.effects,
				A2(
					_elm_lang$core$Basics_ops['++'],
					weapon.uvs,
					_user$project$Knight_Trinket$effects(knight.trinkets))));
		var bonusType = function () {
			var _p11 = weapon.piece.weaponType;
			switch (_p11.ctor) {
				case 'Sword':
					return _user$project$Knight_UV$SwordCTR;
				case 'Gun':
					return _user$project$Knight_UV$GunCTR;
				default:
					return _user$project$Knight_UV$BombCTR;
			}
		}();
		var toBonus = function (uv) {
			var _p12 = uv;
			if ((_p12.ctor === 'WeaponUV') && (_p12._0.ctor === '_Tuple2')) {
				return {ctor: '_Tuple2', _0: _p12._0._0, _1: _p12._0._1};
			} else {
				return {ctor: '_Tuple2', _0: _user$project$Knight_UV$Dmg, _1: _user$project$Knight_UV$Low};
			}
		};
		var bonuses = {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _user$project$Knight_UV$CTR, _1: _user$project$Knight_UV$Medium},
			_1: _elm_lang$core$List$concat(
				{
					ctor: '::',
					_0: knight.helmet.piece.bonuses,
					_1: {
						ctor: '::',
						_0: knight.armour.piece.bonuses,
						_1: {
							ctor: '::',
							_0: A2(_elm_lang$core$List$map, toBonus, uvs),
							_1: {ctor: '[]'}
						}
					}
				})
		};
		var boost = A2(
			_elm_lang$core$Basics$min,
			6,
			_user$project$Knight$sum(
				A2(
					_elm_lang$core$List$map,
					_user$project$Knight_UV$toBonus,
					A2(
						_elm_lang$core$List$map,
						_elm_lang$core$Tuple$second,
						A2(
							_elm_lang$core$List$filter,
							function (_p13) {
								var _p14 = _p13;
								var _p15 = _p14._0;
								return _elm_lang$core$Native_Utils.eq(_p15, _user$project$Knight_UV$CTR) || _elm_lang$core$Native_Utils.eq(_p15, bonusType);
							},
							bonuses)))));
		return weapon.piece.chargeTime * (1 - (_elm_lang$core$Basics$toFloat(boost) * 7.5e-2));
	});
var _user$project$Knight$defences = F2(
	function (lockdown, knight) {
		var applyLockdown = function (_p16) {
			var _p17 = _p16;
			return {
				ctor: '_Tuple2',
				_0: _p17._0,
				_1: A2(
					_elm_lang$core$Basics$max,
					lockdown ? 100 : 0,
					_p17._1)
			};
		};
		var uvs = _elm_lang$core$List$concat(
			{
				ctor: '::',
				_0: knight.helmet.uvs,
				_1: {
					ctor: '::',
					_0: knight.armour.uvs,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Trinket$effects(knight.trinkets),
						_1: {ctor: '[]'}
					}
				}
			});
		var defs = _elm_lang$core$List$concat(
			{
				ctor: '::',
				_0: knight.helmet.piece.defences,
				_1: {
					ctor: '::',
					_0: knight.armour.piece.defences,
					_1: {
						ctor: '::',
						_0: A2(_elm_lang$core$List$map, _user$project$Knight$toDefence, uvs),
						_1: {ctor: '[]'}
					}
				}
			});
		var total = function (dtype) {
			return A2(
				_user$project$Knight$secondTo,
				dtype,
				_user$project$Knight$sum(
					A2(
						_elm_lang$core$List$map,
						_elm_lang$core$Tuple$second,
						A2(
							_elm_lang$core$List$filter,
							_user$project$Knight$isType(dtype),
							defs))));
		};
		return A2(
			_elm_lang$core$List$filter,
			_user$project$Knight$nonZero,
			A2(
				_elm_lang$core$List$map,
				applyLockdown,
				A2(
					_elm_lang$core$List$map,
					total,
					{
						ctor: '::',
						_0: _user$project$Knight_UV$Normal,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_UV$Piercing,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_UV$Elemental,
								_1: {
									ctor: '::',
									_0: _user$project$Knight_UV$Shadow,
									_1: {ctor: '[]'}
								}
							}
						}
					})));
	});
var _user$project$Knight$defence = F3(
	function (lockdown, knight, dType) {
		return _elm_lang$core$Tuple$second(
			A2(
				_elm_lang$core$Maybe$withDefault,
				{ctor: '_Tuple2', _0: dType, _1: 0},
				A2(
					_user$project$Util$find,
					function (_p18) {
						var _p19 = _p18;
						return _elm_lang$core$Native_Utils.eq(_p19._0, dType);
					},
					A2(_user$project$Knight$defences, lockdown, knight))));
	});
var _user$project$Knight$resistances = function (knight) {
	var uvs = _elm_lang$core$List$concat(
		{
			ctor: '::',
			_0: knight.helmet.uvs,
			_1: {
				ctor: '::',
				_0: knight.armour.uvs,
				_1: {
					ctor: '::',
					_0: knight.shield.piece.effects,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Trinket$effects(knight.trinkets),
						_1: {ctor: '[]'}
					}
				}
			}
		});
	var resistances = _elm_lang$core$List$concat(
		{
			ctor: '::',
			_0: knight.helmet.piece.resistances,
			_1: {
				ctor: '::',
				_0: knight.armour.piece.resistances,
				_1: {
					ctor: '::',
					_0: A2(_elm_lang$core$List$map, _user$project$Knight$toResistance, uvs),
					_1: {ctor: '[]'}
				}
			}
		});
	var total = function (status) {
		return A2(
			_user$project$Knight$secondTo,
			status,
			A2(
				_elm_lang$core$Basics$max,
				-8,
				A2(
					_elm_lang$core$Basics$min,
					10,
					_user$project$Knight$sum(
						A2(
							_elm_lang$core$List$map,
							_elm_lang$core$Tuple$second,
							A2(
								_elm_lang$core$List$filter,
								_user$project$Knight$isType(status),
								resistances))))));
	};
	return A2(
		_elm_lang$core$List$filter,
		_user$project$Knight$nonZero,
		A2(
			_elm_lang$core$List$map,
			total,
			{
				ctor: '::',
				_0: _user$project$Knight_Status$Fire,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Status$Freeze,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Status$Shock,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Status$Poison,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_Status$Stun,
								_1: {
									ctor: '::',
									_0: _user$project$Knight_Status$Curse,
									_1: {
										ctor: '::',
										_0: _user$project$Knight_Status$Sleep,
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}));
};
var _user$project$Knight$resistance = F2(
	function (knight, status) {
		return _elm_lang$core$Tuple$second(
			A2(
				_elm_lang$core$Maybe$withDefault,
				{ctor: '_Tuple2', _0: status, _1: 0},
				A2(
					_user$project$Util$find,
					function (_p20) {
						var _p21 = _p20;
						return _elm_lang$core$Native_Utils.eq(_p21._0, status);
					},
					_user$project$Knight$resistances(knight))));
	});
var _user$project$Knight$attacks = F2(
	function (knight, weapon) {
		var toIntBoost = function (_p22) {
			var _p23 = _p22;
			return {
				ctor: '_Tuple2',
				_0: _p23._0,
				_1: _user$project$Knight_UV$toDamageBonus(_p23._1)
			};
		};
		var bonuses = A2(
			_elm_lang$core$List$map,
			toIntBoost,
			_elm_lang$core$List$concat(
				{
					ctor: '::',
					_0: knight.helmet.piece.bonuses,
					_1: {
						ctor: '::',
						_0: knight.armour.piece.bonuses,
						_1: {ctor: '[]'}
					}
				}));
		var uvs = A2(
			_elm_lang$core$List$map,
			_user$project$Knight$toDamageBoost,
			_elm_lang$core$List$concat(
				{
					ctor: '::',
					_0: knight.shield.piece.effects,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Trinket$effects(knight.trinkets),
						_1: {ctor: '[]'}
					}
				}));
		var total = function (bonus) {
			return A2(
				_elm_lang$core$Basics$min,
				24,
				_user$project$Knight$sum(
					A2(
						_elm_lang$core$List$map,
						_elm_lang$core$Tuple$second,
						A2(
							_elm_lang$core$List$filter,
							function (_p24) {
								var _p25 = _p24;
								var _p26 = _p25._0;
								return _elm_lang$core$Native_Utils.eq(_p26, bonus) || _elm_lang$core$Native_Utils.eq(_p26, _user$project$Knight_UV$Dmg);
							},
							A2(_elm_lang$core$Basics_ops['++'], uvs, bonuses)))));
		};
		var piece = weapon.piece;
		var bonusType = function () {
			var _p27 = piece.weaponType;
			switch (_p27.ctor) {
				case 'Sword':
					return _user$project$Knight_UV$SwordDmg;
				case 'Gun':
					return _user$project$Knight_UV$GunDmg;
				default:
					return _user$project$Knight_UV$BombDmg;
			}
		}();
		var boosted = function (damage) {
			return (damage * _elm_lang$core$Basics$toFloat(
				100 + total(bonusType))) / 100;
		};
		var boost = function (_p28) {
			var _p29 = _p28;
			var _p33 = _p29._0;
			var toStatusValues = function (infliction) {
				var _p30 = infliction;
				if ((_p30.ctor === 'Just') && (_p30._0.ctor === '_Tuple3')) {
					return _elm_lang$core$Maybe$Just(
						{ctor: '_Tuple2', _0: _p30._0._1, _1: _p30._0._2});
				} else {
					return _elm_lang$core$Maybe$Nothing;
				}
			};
			var isStage = F2(
				function (stage, _p31) {
					var _p32 = _p31;
					return _elm_lang$core$Native_Utils.eq(stage, _p32._0);
				});
			var infliction = toStatusValues(
				_elm_lang$core$List$head(
					A2(
						_elm_lang$core$List$filter,
						isStage(_p33),
						piece.inflictions)));
			return {
				ctor: '_Tuple2',
				_0: {
					ctor: '_Tuple2',
					_0: _p33,
					_1: boosted(_p29._1)
				},
				_1: infliction
			};
		};
		return A2(_elm_lang$core$List$map, boost, piece.attacks);
	});
var _user$project$Knight$hearts = function (knight) {
	return ((((5 + knight.vita) + knight.helmet.piece.hearts) + knight.armour.piece.hearts) + _elm_lang$core$List$sum(
		A2(_elm_lang$core$List$map, _user$project$Knight_UV$toHearts, knight.shield.piece.effects))) + _user$project$Knight_Trinket$hearts(knight.trinkets);
};
var _user$project$Knight$health = function (knight) {
	return 40 * _user$project$Knight$hearts(knight);
};
var _user$project$Knight$weapons = A2(
	_elm_lang$core$Basics_ops['++'],
	_user$project$Knight_Swords$swords,
	A2(_elm_lang$core$Basics_ops['++'], _user$project$Knight_Guns$guns, _user$project$Knight_Bombs$bombs));
var _user$project$Knight$Knight = F7(
	function (a, b, c, d, e, f, g) {
		return {name: a, weapons: b, helmet: c, armour: d, shield: e, trinkets: f, vita: g};
	});
var _user$project$Knight$WeaponEquip = F2(
	function (a, b) {
		return {piece: a, uvs: b};
	});
var _user$project$Knight$ArmourEquip = F2(
	function (a, b) {
		return {piece: a, uvs: b};
	});
var _user$project$Knight$ShieldEquip = F2(
	function (a, b) {
		return {piece: a, uvs: b};
	});

var _user$project$Events$resist = F2(
	function (resistance, infliction) {
		return A2(_elm_lang$core$Basics$min, 8, infliction - resistance);
	});
var _user$project$Events$defend = F2(
	function (defence, damage) {
		var log10 = _elm_lang$core$Basics$logBase(10);
		return (_elm_lang$core$Native_Utils.cmp(defence * 2, damage) < 0) ? (damage - defence) : (damage * (1 - (0.5 + (0.19 * log10((((2 * defence) - damage) / 15) + 1)))));
	});
var _user$project$Events$Right = {ctor: 'Right'};
var _user$project$Events$Left = {ctor: 'Left'};
var _user$project$Events$statuses = F4(
	function (offenderSide, left, right, history) {
		var knight = _elm_lang$core$Native_Utils.eq(offenderSide, _user$project$Events$Left) ? right : left;
		var isStatus = F2(
			function (status, _p0) {
				var _p1 = _p0;
				var _p3 = _p1._0;
				var _p2 = _p1._1;
				_v1_2:
				do {
					switch (_p2.ctor) {
						case 'Infliction':
							if (_p2._0.ctor === '_Tuple2') {
								return _elm_lang$core$Native_Utils.eq(_p3, offenderSide) && _elm_lang$core$Native_Utils.eq(_p2._0._0, status);
							} else {
								break _v1_2;
							}
						case 'Recovery':
							return (!_elm_lang$core$Native_Utils.eq(_p3, offenderSide)) && _elm_lang$core$Native_Utils.eq(_p2._0, status);
						default:
							break _v1_2;
					}
				} while(false);
				return false;
			});
		var toInfliction = function (status) {
			var _p4 = A2(
				_user$project$Util$find,
				isStatus(status),
				history);
			if ((((_p4.ctor === 'Just') && (_p4._0.ctor === '_Tuple2')) && (_p4._0._1.ctor === 'Infliction')) && (_p4._0._1._0.ctor === '_Tuple2')) {
				var res = A2(_user$project$Knight$resistance, knight, status);
				var str = _user$project$Knight_Types$statusStrength(_p4._0._1._0._1);
				var value = A2(_user$project$Events$resist, res, str);
				return (_elm_lang$core$Native_Utils.cmp(value, -6) < 0) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(
					{ctor: '_Tuple2', _0: _p4._0._1._0._0, _1: value});
			} else {
				return _elm_lang$core$Maybe$Nothing;
			}
		};
		var statuses = {
			ctor: '::',
			_0: _user$project$Knight_Status$Fire,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Status$Freeze,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Status$Poison,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Status$Shock,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Status$Stun,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_Status$Sleep,
								_1: {
									ctor: '::',
									_0: _user$project$Knight_Status$Curse,
									_1: {
										ctor: '::',
										_0: _user$project$Knight_Status$Deathmark,
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		};
		return A2(_elm_lang$core$List$filterMap, toInfliction, statuses);
	});
var _user$project$Events$defenceModifier = F4(
	function (offenderSide, left, right, history) {
		var inflictions = A4(_user$project$Events$statuses, offenderSide, left, right, history);
		var findStatus = function (status) {
			return A2(
				_user$project$Util$find,
				function (_p5) {
					var _p6 = _p5;
					return _elm_lang$core$Native_Utils.eq(_p6._0, status);
				},
				inflictions);
		};
		var poison = function () {
			var _p7 = findStatus(_user$project$Knight_Status$Poison);
			if (((_p7.ctor === 'Just') && (_p7._0.ctor === '_Tuple2')) && (_p7._0._0.ctor === 'Poison')) {
				return (200 - _user$project$Knight_Status$poisonFactor(_p7._0._1)) / 200;
			} else {
				return 1;
			}
		}();
		var deathmark = function () {
			var _p8 = findStatus(_user$project$Knight_Status$Deathmark);
			if (((_p8.ctor === 'Just') && (_p8._0.ctor === '_Tuple2')) && (_p8._0._0.ctor === 'Deathmark')) {
				return 0;
			} else {
				return 1;
			}
		}();
		return (1 * poison) * deathmark;
	});
var _user$project$Events$attackModifier = F4(
	function (offenderSide, left, right, history) {
		var inflictions = A4(_user$project$Events$statuses, offenderSide, left, right, history);
		var findStatus = function (status) {
			return A2(
				_user$project$Util$find,
				function (_p9) {
					var _p10 = _p9;
					return _elm_lang$core$Native_Utils.eq(_p10._0, status);
				},
				inflictions);
		};
		var poison = function () {
			var _p11 = findStatus(_user$project$Knight_Status$Poison);
			if (((_p11.ctor === 'Just') && (_p11._0.ctor === '_Tuple2')) && (_p11._0._0.ctor === 'Poison')) {
				return (100 - _user$project$Knight_Status$poisonFactor(_p11._0._1)) / 100;
			} else {
				return 1;
			}
		}();
		return 1 * poison;
	});
var _user$project$Events$damage = F6(
	function (lockdown, offenderSide, left, right, history, _p12) {
		var _p13 = _p12;
		var _p23 = _p13._1;
		var dMod = A4(_user$project$Events$defenceModifier, offenderSide, left, right, history);
		var defender = _elm_lang$core$Native_Utils.eq(offenderSide, _user$project$Events$Left) ? right : left;
		var defence = function (dType) {
			return A3(_user$project$Knight$defence, lockdown, defender, dType);
		};
		var statusDamage = function () {
			var _p14 = _p23;
			if ((_p14.ctor === 'Infliction') && (_p14._0.ctor === '_Tuple2')) {
				var _p16 = _p14._0._0;
				var resistance = A2(_user$project$Knight$resistance, defender, _p16);
				var severity = A2(
					_user$project$Events$resist,
					resistance,
					_user$project$Knight_Types$statusStrength(_p14._0._1));
				var _p15 = _p16;
				switch (_p15.ctor) {
					case 'Fire':
						return _elm_lang$core$Basics$toFloat(
							_user$project$Knight_Status$fireTotal(severity));
					case 'Shock':
						return A2(
							_user$project$Events$defend,
							dMod * defence(_user$project$Knight_UV$Elemental),
							_user$project$Knight_Status$shockDamage);
					case 'Sleep':
						return _elm_lang$core$Basics$toFloat(
							-1 * _user$project$Knight_Status$sleepHeal(severity));
					default:
						return 0;
				}
			} else {
				return 0;
			}
		}();
		var offender = _elm_lang$core$Native_Utils.eq(offenderSide, _user$project$Events$Left) ? left : right;
		var weapon = function () {
			var _p17 = _p23;
			if ((_p17.ctor === 'Attack') && (_p17._0.ctor === '_Tuple2')) {
				return A2(
					_user$project$Util$find,
					function (eq) {
						return _elm_lang$core$Native_Utils.eq(eq.piece.name, _p17._0._0);
					},
					offender.weapons);
			} else {
				return _elm_lang$core$Maybe$Nothing;
			}
		}();
		var attack = function () {
			var _p18 = {ctor: '_Tuple2', _0: _p23, _1: weapon};
			if ((((_p18.ctor === '_Tuple2') && (_p18._0.ctor === 'Attack')) && (_p18._0._0.ctor === '_Tuple2')) && (_p18._1.ctor === 'Just')) {
				return A2(
					_user$project$Util$find,
					function (attack) {
						return _elm_lang$core$Native_Utils.eq(
							_elm_lang$core$Tuple$first(attack),
							_p18._0._0._1);
					},
					A2(
						_elm_lang$core$List$map,
						_elm_lang$core$Tuple$first,
						A2(_user$project$Knight$attacks, offender, _p18._1._0)));
			} else {
				return _elm_lang$core$Maybe$Nothing;
			}
		}();
		var defenderSide = _elm_lang$core$Native_Utils.eq(offenderSide, _user$project$Events$Left) ? _user$project$Events$Right : _user$project$Events$Left;
		var aMod = A4(_user$project$Events$attackModifier, defenderSide, left, right, history);
		if (!_elm_lang$core$Native_Utils.eq(_p13._0, offenderSide)) {
			return 0;
		} else {
			var _p19 = {ctor: '_Tuple2', _0: attack, _1: weapon};
			if ((((_p19.ctor === '_Tuple2') && (_p19._0.ctor === 'Just')) && (_p19._0._0.ctor === '_Tuple2')) && (_p19._1.ctor === 'Just')) {
				var _p22 = _p19._1._0;
				var _p21 = _p19._0._0._1;
				var _p20 = _p22.piece.split;
				if (_p20.ctor === 'Just') {
					return A2(
						_user$project$Events$defend,
						dMod * defence(_p20._0),
						(aMod * _p21) / 2) + A2(
						_user$project$Events$defend,
						dMod * defence(_p22.piece.damageType),
						(aMod * _p21) / 2);
				} else {
					return A2(
						_user$project$Events$defend,
						dMod * defence(_p22.piece.damageType),
						aMod * _p21);
				}
			} else {
				return statusDamage;
			}
		}
	});
var _user$project$Events$totalDamage = F5(
	function (lockdown, offenderSide, left, right, history) {
		var defender = _elm_lang$core$Native_Utils.eq(offenderSide, _user$project$Events$Left) ? right : left;
		var recurse = A4(_user$project$Events$totalDamage, lockdown, offenderSide, left, right);
		var dmg = A4(_user$project$Events$damage, lockdown, offenderSide, left, right);
		var _p24 = history;
		if (_p24.ctor === '[]') {
			return 0;
		} else {
			var _p25 = _p24._1;
			return A2(
				_elm_lang$core$Basics$min,
				_elm_lang$core$Basics$toFloat(
					_user$project$Knight$health(defender)),
				A2(
					_elm_lang$core$Basics$max,
					0,
					A2(dmg, _p25, _p24._0) + recurse(_p25)));
		}
	});
var _user$project$Events$Recovery = function (a) {
	return {ctor: 'Recovery', _0: a};
};
var _user$project$Events$Infliction = function (a) {
	return {ctor: 'Infliction', _0: a};
};
var _user$project$Events$Attack = function (a) {
	return {ctor: 'Attack', _0: a};
};

var _user$project$View_Shortcuts$divisor = A2(
	_elm_lang$html$Html$div,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Attributes$class('divisor'),
		_1: {ctor: '[]'}
	},
	{ctor: '[]'});
var _user$project$View_Shortcuts$item = F2(
	function (label, content) {
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('item'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$label,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(label),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: content,
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$View_Shortcuts$button = function (attributes) {
	return _elm_lang$html$Html$div(
		A2(
			_elm_lang$core$Basics_ops['++'],
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('button'),
				_1: {ctor: '[]'}
			},
			attributes));
};
var _user$project$View_Shortcuts$tabs = F5(
	function (toLabel, toClass, message, items, selected) {
		var isSelected = function (item) {
			return _elm_lang$core$Native_Utils.eq(selected, item) ? ' selected' : '';
		};
		var tab = function (item) {
			return A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class(
						A2(
							_elm_lang$core$Basics_ops['++'],
							'tab ',
							A2(
								_elm_lang$core$Basics_ops['++'],
								toClass(item),
								isSelected(item)))),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(
							message(item)),
						_1: {ctor: '[]'}
					}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(
						toLabel(item)),
					_1: {ctor: '[]'}
				});
		};
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('tabs'),
				_1: {ctor: '[]'}
			},
			A2(_elm_lang$core$List$map, tab, items));
	});
var _user$project$View_Shortcuts$spacer = A2(
	_elm_lang$html$Html$div,
	{
		ctor: '::',
		_0: _elm_lang$html$Html_Attributes$class('spacer'),
		_1: {ctor: '[]'}
	},
	{ctor: '[]'});
var _user$project$View_Shortcuts$toText = function (arg) {
	return _elm_lang$html$Html$text(
		_elm_lang$core$Basics$toString(arg));
};
var _user$project$View_Shortcuts$bar = F3(
	function (max, color, value) {
		var shift = ((100 * value) / max) - 100;
		var scale = value / max;
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class(
					A2(_elm_lang$core$Basics_ops['++'], 'bar-container ', color)),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('bar-bg'),
						_1: {ctor: '[]'}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('bar-fill'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$style(
									{
										ctor: '::',
										_0: {
											ctor: '_Tuple2',
											_0: 'transform',
											_1: A2(
												_elm_lang$core$Basics_ops['++'],
												'scaleX(',
												A2(
													_elm_lang$core$Basics_ops['++'],
													_elm_lang$core$Basics$toString(scale),
													')'))
										},
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}
						},
						{ctor: '[]'}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$View_Shortcuts$selectOption = F4(
	function (excluded, label, current, thing) {
		var isDisabled = A2(
			_elm_lang$core$List$any,
			function (t) {
				return _elm_lang$core$Native_Utils.eq(
					label(thing),
					label(t));
			},
			excluded);
		return A2(
			_elm_lang$html$Html$option,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$selected(
					_elm_lang$core$Native_Utils.eq(
						label(current),
						label(thing))),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$disabled(
						(!_elm_lang$core$Native_Utils.eq(
							label(current),
							label(thing))) && isDisabled),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$value(
							label(thing)),
						_1: {ctor: '[]'}
					}
				}
			},
			{
				ctor: '::',
				_0: _elm_lang$html$Html$text(
					label(thing)),
				_1: {ctor: '[]'}
			});
	});
var _user$project$View_Shortcuts$signal = F5(
	function (message, label, things, current, selected) {
		var _p0 = _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (t) {
					return _elm_lang$core$Native_Utils.eq(
						label(t),
						selected);
				},
				things));
		if (_p0.ctor === 'Just') {
			return message(_p0._0);
		} else {
			return message(current);
		}
	});
var _user$project$View_Shortcuts$selectListExclude = F5(
	function (exclude, label, message, things, current) {
		var sorted = A2(_elm_lang$core$List$sortBy, label, things);
		var selectThing = A4(_user$project$View_Shortcuts$signal, message, label, things, current);
		return A2(
			_elm_lang$html$Html$select,
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html_Events$on,
					'change',
					A2(_elm_lang$core$Json_Decode$map, selectThing, _elm_lang$html$Html_Events$targetValue)),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$option,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$disabled(true),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$selected(
								!A2(_elm_lang$core$List$member, current, things)),
							_1: {ctor: '[]'}
						}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('-- Pick a loadout -- '),
						_1: {ctor: '[]'}
					}),
				_1: A2(
					_elm_lang$core$List$map,
					A3(_user$project$View_Shortcuts$selectOption, exclude, label, current),
					sorted)
			});
	});
var _user$project$View_Shortcuts$selectList = _user$project$View_Shortcuts$selectListExclude(
	{ctor: '[]'});

var _user$project$Events_View$log = F4(
	function (message, events, left, right) {
		var button = function (index) {
			return A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('button'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(
							message(
								A2(_user$project$Util$remove, index, events))),
						_1: {ctor: '[]'}
					}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text('-'),
					_1: {ctor: '[]'}
				});
		};
		var getOpponent = function (side) {
			return _elm_lang$core$Native_Utils.eq(side, _user$project$Events$Left) ? right : left;
		};
		var getKnight = function (side) {
			return _elm_lang$core$Native_Utils.eq(side, _user$project$Events$Left) ? left : right;
		};
		var eventEntry = F3(
			function (index, history, _p0) {
				var _p1 = _p0;
				var _p7 = _p1._0;
				var _p6 = _p1._1;
				var opponent = getOpponent(_p7);
				var knight = getKnight(_p7);
				var _p2 = _p6;
				switch (_p2.ctor) {
					case 'Attack':
						var damage = A6(
							_user$project$Events$damage,
							true,
							_p7,
							left,
							right,
							history,
							{ctor: '_Tuple2', _0: _p7, _1: _p6});
						return A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class(
									A2(
										_elm_lang$core$Basics_ops['++'],
										'event ',
										_elm_lang$core$Basics$toString(_p7))),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('attack flow header'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('knight-name'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text(
													function (_) {
														return _.name;
													}(knight)),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('weapon'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(_p2._0._0),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: button(index),
												_1: {ctor: '[]'}
											}
										}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('attack flow'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('attack-stage'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _user$project$View_Shortcuts$toText(_p2._0._1),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$div,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$class('attack-damage'),
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: _user$project$View_Shortcuts$toText(
															_elm_lang$core$Basics$ceiling(damage)),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}
										}),
									_1: {ctor: '[]'}
								}
							});
					case 'Infliction':
						var _p4 = _p2._0._0;
						var spasmDamage = _user$project$Knight_Status$shockDamage;
						var shockDefence = _elm_lang$core$Tuple$second(
							A2(
								_elm_lang$core$Maybe$withDefault,
								{ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: 0},
								A2(
									_user$project$Util$find,
									function (def) {
										return _elm_lang$core$Native_Utils.eq(
											_elm_lang$core$Tuple$first(def),
											_user$project$Knight_UV$Elemental);
									},
									A2(_user$project$Knight$defences, true, opponent)))) * A4(_user$project$Events$defenceModifier, _p7, left, right, history);
						var resistance = A2(_user$project$Knight$resistance, opponent, _p4);
						var severity = A2(
							_user$project$Events$resist,
							resistance,
							_user$project$Knight_Types$statusStrength(_p2._0._1));
						var duration = A2(_user$project$Knight_Status$duration, _p4, severity);
						var fire = _user$project$Knight_Status$fireDamage(severity);
						var fireTicks = _user$project$Knight_Status$fireTicks(severity);
						var totalFire = _user$project$Knight_Status$fireTotal(severity);
						var poison = _user$project$Knight_Status$poisonFactor(severity);
						var cursedVials = _user$project$Knight_Status$curseVials(severity);
						var cursedWeapons = _user$project$Knight_Status$curseSlots(severity);
						var curseDamage = _user$project$Knight_Status$curseDamage(severity);
						var spasmDuration = _user$project$Knight_Status$spasm(severity);
						var stun = _user$project$Knight_Status$stunFactor(severity);
						var sleep = _user$project$Knight_Status$sleepHeal(severity);
						var description = {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('Lasts for '),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$span,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('status-duration'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text(
													_user$project$Util$pretty(duration)),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html$text(' seconds'),
											_1: {ctor: '[]'}
										}
									}
								}),
							_1: function () {
								var _p3 = _p4;
								switch (_p3.ctor) {
									case 'Fire':
										return {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Suffer burns '),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$span,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: _user$project$View_Shortcuts$toText(fireTicks),
																_1: {ctor: '[]'}
															}),
														_1: {
															ctor: '::',
															_0: _elm_lang$html$Html$text(' times'),
															_1: {ctor: '[]'}
														}
													}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$div,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Burn deals '),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$html$Html$span,
																{
																	ctor: '::',
																	_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																	_1: {ctor: '[]'}
																},
																{
																	ctor: '::',
																	_0: _user$project$View_Shortcuts$toText(fire),
																	_1: {ctor: '[]'}
																}),
															_1: {
																ctor: '::',
																_0: _elm_lang$html$Html$text(' damage'),
																_1: {ctor: '[]'}
															}
														}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$div,
														{ctor: '[]'},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('Total: '),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$html$Html$span,
																	{
																		ctor: '::',
																		_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																		_1: {ctor: '[]'}
																	},
																	{
																		ctor: '::',
																		_0: _user$project$View_Shortcuts$toText(totalFire),
																		_1: {ctor: '[]'}
																	}),
																_1: {ctor: '[]'}
															}
														}),
													_1: {ctor: '[]'}
												}
											}
										};
									case 'Freeze':
										return {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Cannot '),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$span,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: _elm_lang$html$Html$text('move'),
																_1: {ctor: '[]'}
															}),
														_1: {ctor: '[]'}
													}
												}),
											_1: {ctor: '[]'}
										};
									case 'Poison':
										return {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Damage reduced '),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$span,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: _elm_lang$html$Html$text(
																	A2(
																		_elm_lang$core$Basics_ops['++'],
																		_user$project$Util$pretty(poison),
																		'%')),
																_1: {ctor: '[]'}
															}),
														_1: {ctor: '[]'}
													}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$div,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Defence reduced '),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$html$Html$span,
																{
																	ctor: '::',
																	_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																	_1: {ctor: '[]'}
																},
																{
																	ctor: '::',
																	_0: _elm_lang$html$Html$text(
																		A2(
																			_elm_lang$core$Basics_ops['++'],
																			_user$project$Util$pretty(poison / 2),
																			'%')),
																	_1: {ctor: '[]'}
																}),
															_1: {ctor: '[]'}
														}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$div,
														{ctor: '[]'},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('Cannot '),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$html$Html$span,
																	{
																		ctor: '::',
																		_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																		_1: {ctor: '[]'}
																	},
																	{
																		ctor: '::',
																		_0: _elm_lang$html$Html$text('heal'),
																		_1: {ctor: '[]'}
																	}),
																_1: {ctor: '[]'}
															}
														}),
													_1: {ctor: '[]'}
												}
											}
										};
									case 'Shock':
										return {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Random shock spasms'),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$div,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Spasm last for '),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$html$Html$span,
																{
																	ctor: '::',
																	_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																	_1: {ctor: '[]'}
																},
																{
																	ctor: '::',
																	_0: _elm_lang$html$Html$text(
																		_user$project$Util$pretty(spasmDuration)),
																	_1: {ctor: '[]'}
																}),
															_1: {
																ctor: '::',
																_0: _elm_lang$html$Html$text(' seconds'),
																_1: {ctor: '[]'}
															}
														}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$div,
														{ctor: '[]'},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('Spams inflict  '),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$html$Html$span,
																	{
																		ctor: '::',
																		_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																		_1: {ctor: '[]'}
																	},
																	{
																		ctor: '::',
																		_0: _user$project$View_Shortcuts$toText(
																			_elm_lang$core$Basics$ceiling(
																				A2(_user$project$Events$defend, shockDefence, spasmDamage))),
																		_1: {ctor: '[]'}
																	}),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$html$Html$text(' damage'),
																	_1: {ctor: '[]'}
																}
															}
														}),
													_1: {ctor: '[]'}
												}
											}
										};
									case 'Stun':
										return {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Speed reduced '),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$span,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: _elm_lang$html$Html$text(
																	A2(
																		_elm_lang$core$Basics_ops['++'],
																		_user$project$Util$pretty(stun),
																		'%')),
																_1: {ctor: '[]'}
															}),
														_1: {ctor: '[]'}
													}
												}),
											_1: {ctor: '[]'}
										};
									case 'Curse':
										return {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Curse '),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$span,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: _user$project$View_Shortcuts$toText(cursedWeapons),
																_1: {ctor: '[]'}
															}),
														_1: {
															ctor: '::',
															_0: _elm_lang$html$Html$text(' random weapons'),
															_1: {ctor: '[]'}
														}
													}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$div,
													{ctor: '[]'},
													{
														ctor: '::',
														_0: _elm_lang$html$Html$text('Curse '),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$html$Html$span,
																{
																	ctor: '::',
																	_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																	_1: {ctor: '[]'}
																},
																{
																	ctor: '::',
																	_0: _user$project$View_Shortcuts$toText(cursedVials),
																	_1: {ctor: '[]'}
																}),
															_1: {
																ctor: '::',
																_0: _elm_lang$html$Html$text(' random vial slots'),
																_1: {ctor: '[]'}
															}
														}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$html$Html$div,
														{ctor: '[]'},
														{
															ctor: '::',
															_0: _elm_lang$html$Html$text('Suffer '),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$html$Html$span,
																	{
																		ctor: '::',
																		_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																		_1: {ctor: '[]'}
																	},
																	{
																		ctor: '::',
																		_0: _user$project$View_Shortcuts$toText(curseDamage),
																		_1: {ctor: '[]'}
																	}),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$html$Html$text(' damage if used'),
																	_1: {ctor: '[]'}
																}
															}
														}),
													_1: {ctor: '[]'}
												}
											}
										};
									case 'Sleep':
										return {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Resting heals '),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$html$Html$span,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$class('status-effect'),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: _user$project$View_Shortcuts$toText(sleep),
																_1: {ctor: '[]'}
															}),
														_1: {
															ctor: '::',
															_0: _elm_lang$html$Html$text(' HP'),
															_1: {ctor: '[]'}
														}
													}
												}),
											_1: {ctor: '[]'}
										};
									case 'Deathmark':
										return {
											ctor: '::',
											_0: _elm_lang$html$Html$text('All defences nullified'),
											_1: {ctor: '[]'}
										};
									default:
										return {ctor: '[]'};
								}
							}()
						};
						return A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class(
									A2(
										_elm_lang$core$Basics_ops['++'],
										'event ',
										_elm_lang$core$Basics$toString(_p7))),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('infliction flow header'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('knight-name'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text(
													function (_) {
														return _.name;
													}(knight)),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: button(index),
											_1: {ctor: '[]'}
										}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('infliction flow'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: _elm_lang$core$Native_Utils.eq(_p4, _user$project$Knight_Status$Deathmark) ? A2(
												_elm_lang$html$Html$div,
												{ctor: '[]'},
												{ctor: '[]'}) : ((_elm_lang$core$Native_Utils.cmp(severity, -6) < 0) ? A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('infliction-strength immune'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Immune!'),
													_1: {ctor: '[]'}
												}) : A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('infliction-strength'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _user$project$View_Shortcuts$toText(severity),
													_1: {ctor: '[]'}
												})),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$div,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$class(
															A2(
																_elm_lang$core$Basics_ops['++'],
																'infliction-status status ',
																_elm_lang$core$Basics$toString(_p4))),
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: _user$project$View_Shortcuts$toText(_p4),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}
										}),
									_1: {
										ctor: '::',
										_0: (_elm_lang$core$Native_Utils.cmp(severity, -6) < 0) ? A2(
											_elm_lang$html$Html$div,
											{ctor: '[]'},
											{ctor: '[]'}) : A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('infliction-description'),
												_1: {ctor: '[]'}
											},
											description),
										_1: {ctor: '[]'}
									}
								}
							});
					default:
						var _p5 = _p2._0;
						return A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class(
									A2(
										_elm_lang$core$Basics_ops['++'],
										'event ',
										_elm_lang$core$Basics$toString(_p7))),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('recovery flow header'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$div,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$class('knight-name'),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text(
													function (_) {
														return _.name;
													}(knight)),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: button(index),
											_1: {ctor: '[]'}
										}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$div,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('recovery flow'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('recovery label'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text('Recovery'),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$div,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$class(
															A2(
																_elm_lang$core$Basics_ops['++'],
																'recovery-status status ',
																_elm_lang$core$Basics$toString(_p5))),
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: _user$project$View_Shortcuts$toText(_p5),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}
										}),
									_1: {ctor: '[]'}
								}
							});
				}
			});
		var eventLog = F3(
			function (index, output, events) {
				var _p8 = events;
				if (_p8.ctor === '[]') {
					return output;
				} else {
					var _p9 = _p8._1;
					return {
						ctor: '::',
						_0: A3(eventEntry, index, _p9, _p8._0),
						_1: A3(eventLog, index + 1, output, _p9)
					};
				}
			});
		var opposing = function (side) {
			return _elm_lang$core$Native_Utils.eq(side, _user$project$Events$Left) ? _user$project$Events$Right : _user$project$Events$Left;
		};
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('events'),
				_1: {ctor: '[]'}
			},
			A3(
				eventLog,
				0,
				{ctor: '[]'},
				events));
	});

var _user$project$Knight_Encode$encode = function (knight) {
	var trinkets = A2(
		_elm_lang$core$String$join,
		'|',
		A2(
			_elm_lang$core$List$map,
			function (_) {
				return _.id;
			},
			knight.trinkets));
	var uvNum = function (strength) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			0,
			A2(
				_user$project$Util$index,
				strength,
				{
					ctor: '::',
					_0: _user$project$Knight_UV$NegLow,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$Low,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_UV$Medium,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_UV$High,
								_1: {
									ctor: '::',
									_0: _user$project$Knight_UV$VeryHigh,
									_1: {
										ctor: '::',
										_0: _user$project$Knight_UV$Ultra,
										_1: {
											ctor: '::',
											_0: _user$project$Knight_UV$Maximum,
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}));
	};
	var uvString = function (effect) {
		var parts = function () {
			var _p0 = effect;
			_v0_3:
			do {
				switch (_p0.ctor) {
					case 'WeaponUV':
						if (_p0._0.ctor === '_Tuple2') {
							var _p1 = _p0._0._0;
							return {
								ctor: '::',
								_0: A2(
									_elm_lang$core$String$left,
									1,
									_elm_lang$core$Basics$toString(_p1)),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$core$String$right,
										1,
										_elm_lang$core$Basics$toString(_p1)),
									_1: {
										ctor: '::',
										_0: _elm_lang$core$Basics$toString(
											uvNum(_p0._0._1)),
										_1: {ctor: '[]'}
									}
								}
							};
						} else {
							break _v0_3;
						}
					case 'StatusUV':
						if (_p0._0.ctor === '_Tuple2') {
							return {
								ctor: '::',
								_0: A2(
									_elm_lang$core$String$left,
									2,
									_elm_lang$core$Basics$toString(_p0._0._0)),
								_1: {
									ctor: '::',
									_0: _elm_lang$core$Basics$toString(
										uvNum(_p0._0._1)),
									_1: {ctor: '[]'}
								}
							};
						} else {
							break _v0_3;
						}
					case 'DefenceUV':
						if (_p0._0.ctor === '_Tuple2') {
							var _p2 = _p0._0._0;
							return {
								ctor: '::',
								_0: A2(
									_elm_lang$core$String$left,
									1,
									_elm_lang$core$Basics$toString(_p2)),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$core$String$right,
										1,
										_elm_lang$core$Basics$toString(_p2)),
									_1: {
										ctor: '::',
										_0: _elm_lang$core$Basics$toString(
											uvNum(_p0._0._1)),
										_1: {ctor: '[]'}
									}
								}
							};
						} else {
							break _v0_3;
						}
					default:
						break _v0_3;
				}
			} while(false);
			return {ctor: '[]'};
		}();
		return A2(
			_elm_lang$core$String$join,
			'',
			A2(_elm_lang$core$List$map, _elm_lang$core$String$toLower, parts));
	};
	var slotString = function (slot) {
		return A2(
			_elm_lang$core$String$join,
			'+',
			A2(
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					}),
				slot.piece.id,
				A2(_elm_lang$core$List$map, uvString, slot.uvs)));
	};
	var weapons = A2(
		_elm_lang$core$String$join,
		'|',
		A2(_elm_lang$core$List$map, slotString, knight.weapons));
	var shield = slotString(knight.shield);
	var gear = A2(
		_elm_lang$core$String$join,
		' ',
		A2(
			_elm_lang$core$List$map,
			slotString,
			{
				ctor: '::',
				_0: knight.helmet,
				_1: {
					ctor: '::',
					_0: knight.armour,
					_1: {ctor: '[]'}
				}
			}));
	var raw = A2(
		_elm_lang$core$String$join,
		' ',
		{
			ctor: '::',
			_0: shield,
			_1: {
				ctor: '::',
				_0: gear,
				_1: {
					ctor: '::',
					_0: weapons,
					_1: {
						ctor: '::',
						_0: trinkets,
						_1: {
							ctor: '::',
							_0: _elm_lang$core$Basics$toString(knight.vita),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
	return _user$project$Util$btoa(raw);
};
var _user$project$Knight_Encode$decode = function (code) {
	var _p3 = _truqu$elm_base64$Base64$decode(code);
	if (_p3.ctor === 'Ok') {
		var _p4 = A2(_elm_lang$core$String$split, ' ', _p3._0);
		if ((((_p4.ctor === '::') && (_p4._1.ctor === '::')) && (_p4._1._1.ctor === '::')) && (_p4._1._1._1.ctor === '::')) {
			var _p8 = _p4._1._1._1._1;
			var id = function (str) {
				return A2(
					_elm_lang$core$Maybe$withDefault,
					'',
					_elm_lang$core$List$head(
						A2(_elm_lang$core$String$split, '+', str)));
			};
			var piece = F2(
				function (items, str) {
					return A2(
						_user$project$Util$find,
						function (item) {
							return _elm_lang$core$Native_Utils.eq(
								item.id,
								id(str));
						},
						items);
				});
			var decodeTrinket = function (str) {
				return A2(piece, _user$project$Knight_Trinket$trinkets, str);
			};
			var bonuses = {
				ctor: '::',
				_0: _user$project$Knight_UV$NegMaximum,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_UV$Low,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$Medium,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_UV$High,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_UV$VeryHigh,
								_1: {
									ctor: '::',
									_0: _user$project$Knight_UV$Ultra,
									_1: {
										ctor: '::',
										_0: _user$project$Knight_UV$Maximum,
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			};
			var decodeUv = function (str) {
				var id = A2(_elm_lang$core$String$dropRight, 1, str);
				var strength = A2(
					_elm_lang$core$Maybe$withDefault,
					_user$project$Knight_UV$NegMaximum,
					A3(
						_elm_lang$core$Basics$flip,
						_user$project$Util$atIndex,
						bonuses,
						A2(
							_elm_lang$core$Result$withDefault,
							0,
							_elm_lang$core$String$toInt(
								A2(_elm_lang$core$String$right, 1, str)))));
				var bonusIds = {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'cr',
						_1: _user$project$Knight_UV$WeaponUV(
							{ctor: '_Tuple2', _0: _user$project$Knight_UV$CTR, _1: strength})
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'ai',
							_1: _user$project$Knight_UV$WeaponUV(
								{ctor: '_Tuple2', _0: _user$project$Knight_UV$ASI, _1: strength})
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'bt',
								_1: _user$project$Knight_UV$WeaponUV(
									{ctor: '_Tuple2', _0: _user$project$Knight_UV$Beast, _1: strength})
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'fd',
									_1: _user$project$Knight_UV$WeaponUV(
										{ctor: '_Tuple2', _0: _user$project$Knight_UV$Fiend, _1: strength})
								},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'gn',
										_1: _user$project$Knight_UV$WeaponUV(
											{ctor: '_Tuple2', _0: _user$project$Knight_UV$Gremlin, _1: strength})
									},
									_1: {
										ctor: '::',
										_0: {
											ctor: '_Tuple2',
											_0: 'se',
											_1: _user$project$Knight_UV$WeaponUV(
												{ctor: '_Tuple2', _0: _user$project$Knight_UV$Slime, _1: strength})
										},
										_1: {
											ctor: '::',
											_0: {
												ctor: '_Tuple2',
												_0: 'ct',
												_1: _user$project$Knight_UV$WeaponUV(
													{ctor: '_Tuple2', _0: _user$project$Knight_UV$Construct, _1: strength})
											},
											_1: {
												ctor: '::',
												_0: {
													ctor: '_Tuple2',
													_0: 'ud',
													_1: _user$project$Knight_UV$WeaponUV(
														{ctor: '_Tuple2', _0: _user$project$Knight_UV$Undead, _1: strength})
												},
												_1: {
													ctor: '::',
													_0: {
														ctor: '_Tuple2',
														_0: 'nl',
														_1: _user$project$Knight_UV$DefenceUV(
															{ctor: '_Tuple2', _0: _user$project$Knight_UV$Normal, _1: strength})
													},
													_1: {
														ctor: '::',
														_0: {
															ctor: '_Tuple2',
															_0: 'pg',
															_1: _user$project$Knight_UV$DefenceUV(
																{ctor: '_Tuple2', _0: _user$project$Knight_UV$Piercing, _1: strength})
														},
														_1: {
															ctor: '::',
															_0: {
																ctor: '_Tuple2',
																_0: 'el',
																_1: _user$project$Knight_UV$DefenceUV(
																	{ctor: '_Tuple2', _0: _user$project$Knight_UV$Elemental, _1: strength})
															},
															_1: {
																ctor: '::',
																_0: {
																	ctor: '_Tuple2',
																	_0: 'sw',
																	_1: _user$project$Knight_UV$DefenceUV(
																		{ctor: '_Tuple2', _0: _user$project$Knight_UV$Shadow, _1: strength})
																},
																_1: {
																	ctor: '::',
																	_0: {
																		ctor: '_Tuple2',
																		_0: 'fi',
																		_1: _user$project$Knight_UV$StatusUV(
																			{ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: strength})
																	},
																	_1: {
																		ctor: '::',
																		_0: {
																			ctor: '_Tuple2',
																			_0: 'fr',
																			_1: _user$project$Knight_UV$StatusUV(
																				{ctor: '_Tuple2', _0: _user$project$Knight_Status$Freeze, _1: strength})
																		},
																		_1: {
																			ctor: '::',
																			_0: {
																				ctor: '_Tuple2',
																				_0: 'sh',
																				_1: _user$project$Knight_UV$StatusUV(
																					{ctor: '_Tuple2', _0: _user$project$Knight_Status$Shock, _1: strength})
																			},
																			_1: {
																				ctor: '::',
																				_0: {
																					ctor: '_Tuple2',
																					_0: 'po',
																					_1: _user$project$Knight_UV$StatusUV(
																						{ctor: '_Tuple2', _0: _user$project$Knight_Status$Poison, _1: strength})
																				},
																				_1: {
																					ctor: '::',
																					_0: {
																						ctor: '_Tuple2',
																						_0: 'st',
																						_1: _user$project$Knight_UV$StatusUV(
																							{ctor: '_Tuple2', _0: _user$project$Knight_Status$Stun, _1: strength})
																					},
																					_1: {
																						ctor: '::',
																						_0: {
																							ctor: '_Tuple2',
																							_0: 'cu',
																							_1: _user$project$Knight_UV$StatusUV(
																								{ctor: '_Tuple2', _0: _user$project$Knight_Status$Curse, _1: strength})
																						},
																						_1: {ctor: '[]'}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				};
				var _p7 = A2(
					_user$project$Util$find,
					function (_p5) {
						var _p6 = _p5;
						return _elm_lang$core$Native_Utils.eq(id, _p6._0);
					},
					bonusIds);
				if ((_p7.ctor === 'Just') && (_p7._0.ctor === '_Tuple2')) {
					return _elm_lang$core$Maybe$Just(_p7._0._1);
				} else {
					return _elm_lang$core$Maybe$Nothing;
				}
			};
			var uvs = function (str) {
				return A2(
					_elm_lang$core$List$filterMap,
					decodeUv,
					A2(
						_elm_lang$core$List$drop,
						1,
						A2(_elm_lang$core$String$split, '+', str)));
			};
			var decodeWeapon = function (str) {
				return {
					piece: A2(
						_elm_lang$core$Maybe$withDefault,
						_user$project$Knight_Swords$sword,
						A2(piece, _user$project$Knight$weapons, str)),
					uvs: uvs(str)
				};
			};
			var decodeArmour = function (str) {
				return {
					piece: A2(
						_elm_lang$core$Maybe$withDefault,
						_user$project$Knight_Armour$base,
						A2(piece, _user$project$Knight_Armour$armours, str)),
					uvs: uvs(str)
				};
			};
			var decodeShield = function (str) {
				return {
					piece: A2(
						_elm_lang$core$Maybe$withDefault,
						_user$project$Knight_Shield$aegis,
						A2(piece, _user$project$Knight_Shield$shields, str)),
					uvs: uvs(str)
				};
			};
			return _elm_lang$core$Maybe$Just(
				{
					name: 'Encoded',
					weapons: A2(
						_elm_lang$core$List$map,
						decodeWeapon,
						A2(_elm_lang$core$String$split, '|', _p4._1._1._1._0)),
					helmet: decodeArmour(_p4._1._0),
					armour: decodeArmour(_p4._1._1._0),
					shield: decodeShield(_p4._0),
					trinkets: A2(
						_elm_lang$core$List$filterMap,
						decodeTrinket,
						A2(
							_elm_lang$core$String$split,
							'|',
							A2(
								_elm_lang$core$Maybe$withDefault,
								'',
								_elm_lang$core$List$head(_p8)))),
					vita: A2(
						_elm_lang$core$Result$withDefault,
						0,
						_elm_lang$core$String$toInt(
							A2(
								_elm_lang$core$Maybe$withDefault,
								'0',
								_elm_lang$core$List$head(
									A2(_elm_lang$core$List$drop, 1, _p8)))))
				});
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};

var _user$project$Knight_UV_Form$trinketForm = F4(
	function (swap, remove, index, trinket) {
		var label = A2(
			_elm_lang$core$Basics_ops['++'],
			'Trinket ',
			_elm_lang$core$Basics$toString(index + 1));
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('item slot'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$label,
					{ctor: '[]'},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(label),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A4(
						_user$project$View_Shortcuts$selectList,
						function (_) {
							return _.name;
						},
						swap(index),
						_user$project$Knight_Trinket$trinkets,
						trinket),
					_1: {
						ctor: '::',
						_0: _user$project$View_Shortcuts$spacer,
						_1: {
							ctor: '::',
							_0: A2(
								_user$project$View_Shortcuts$button,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Events$onClick(
										remove(index)),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text('-'),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}
				}
			});
	});
var _user$project$Knight_UV_Form$trinketForms = F2(
	function (message, trinkets) {
		var removeTrinket = function (index) {
			return message(
				A2(_user$project$Util$remove, index, trinkets));
		};
		var addTrinket = message(
			A2(
				_elm_lang$core$Basics_ops['++'],
				trinkets,
				{
					ctor: '::',
					_0: _user$project$Knight_Trinket$penta,
					_1: {ctor: '[]'}
				}));
		var swapTrinket = F2(
			function (index, trinket) {
				return message(
					A3(_user$project$Util$replace, trinkets, index, trinket));
			});
		var form = A2(_user$project$Knight_UV_Form$trinketForm, swapTrinket, removeTrinket);
		return A2(
			_elm_lang$core$Basics_ops['++'],
			A2(_elm_lang$core$List$indexedMap, form, trinkets),
			(_elm_lang$core$Native_Utils.cmp(
				_elm_lang$core$List$length(trinkets),
				2) < 0) ? {
				ctor: '::',
				_0: A2(
					_user$project$View_Shortcuts$button,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(addTrinket),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('+ Trinket'),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			} : {ctor: '[]'});
	});
var _user$project$Knight_UV_Form$uvName = function (equip) {
	var _p0 = equip;
	switch (_p0.ctor) {
		case 'WeaponUV':
			return _elm_lang$core$Basics$toString(_p0._0._0);
		case 'DefenceUV':
			return _elm_lang$core$Basics$toString(_p0._0._0);
		case 'StatusUV':
			return _elm_lang$core$Basics$toString(_p0._0._0);
		default:
			return 'HP';
	}
};
var _user$project$Knight_UV_Form$weaponUvs = {
	ctor: '::',
	_0: _user$project$Knight_UV$ASI,
	_1: {
		ctor: '::',
		_0: _user$project$Knight_UV$CTR,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$Beast,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$Fiend,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_UV$Gremlin,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$Slime,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_UV$Construct,
							_1: {
								ctor: '::',
								_0: _user$project$Knight_UV$Undead,
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Knight_UV_Form$composedWeaponUvs = A2(
	_elm_lang$core$List$map,
	function (bonus) {
		return _user$project$Knight_UV$WeaponUV(
			{ctor: '_Tuple2', _0: bonus, _1: _user$project$Knight_UV$Low});
	},
	_user$project$Knight_UV_Form$weaponUvs);
var _user$project$Knight_UV_Form$statusUvs = {
	ctor: '::',
	_0: _user$project$Knight_Status$Fire,
	_1: {
		ctor: '::',
		_0: _user$project$Knight_Status$Freeze,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_Status$Shock,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_Status$Poison,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_Status$Stun,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_Status$Curse,
						_1: {
							ctor: '::',
							_0: _user$project$Knight_Status$Sleep,
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	}
};
var _user$project$Knight_UV_Form$composedStatusUvs = A2(
	_elm_lang$core$List$map,
	function (status) {
		return _user$project$Knight_UV$StatusUV(
			{ctor: '_Tuple2', _0: status, _1: _user$project$Knight_UV$Low});
	},
	_user$project$Knight_UV_Form$statusUvs);
var _user$project$Knight_UV_Form$defenceUvs = {
	ctor: '::',
	_0: _user$project$Knight_UV$Normal,
	_1: {
		ctor: '::',
		_0: _user$project$Knight_UV$Piercing,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$Elemental,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$Shadow,
				_1: {ctor: '[]'}
			}
		}
	}
};
var _user$project$Knight_UV_Form$composedDefenceUvs = A2(
	_elm_lang$core$List$map,
	function (dType) {
		return _user$project$Knight_UV$DefenceUV(
			{ctor: '_Tuple2', _0: dType, _1: _user$project$Knight_UV$Low});
	},
	_user$project$Knight_UV_Form$defenceUvs);
var _user$project$Knight_UV_Form$asName = function (name) {
	return {name: name};
};
var _user$project$Knight_UV_Form$strengths = {
	ctor: '::',
	_0: _user$project$Knight_UV$Low,
	_1: {
		ctor: '::',
		_0: _user$project$Knight_UV$Medium,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$High,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$VeryHigh,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_UV$Ultra,
					_1: {
						ctor: '::',
						_0: _user$project$Knight_UV$Maximum,
						_1: {ctor: '[]'}
					}
				}
			}
		}
	}
};
var _user$project$Knight_UV_Form$uvStrength = function (equip) {
	var _p1 = equip;
	switch (_p1.ctor) {
		case 'WeaponUV':
			return _p1._0._1;
		case 'DefenceUV':
			return _p1._0._1;
		case 'StatusUV':
			return _p1._0._1;
		default:
			return A2(
				_elm_lang$core$Maybe$withDefault,
				_user$project$Knight_UV$Low,
				A2(_user$project$Util$atIndex, _p1._0 - 1, _user$project$Knight_UV_Form$strengths));
	}
};
var _user$project$Knight_UV_Form$uvForms = F4(
	function (availableUvs, uvStrengths, message, equipment) {
		var uvs = equipment.uvs;
		var existingNames = A2(_elm_lang$core$List$map, _user$project$Knight_UV_Form$uvName, uvs);
		var swapType = F3(
			function (equip, index, option) {
				var status = _elm_lang$core$List$head(
					A2(
						_elm_lang$core$List$filter,
						function (sType) {
							return _elm_lang$core$Native_Utils.eq(
								option,
								_elm_lang$core$Basics$toString(sType));
						},
						_user$project$Knight_UV_Form$statusUvs));
				var defence = _elm_lang$core$List$head(
					A2(
						_elm_lang$core$List$filter,
						function (dType) {
							return _elm_lang$core$Native_Utils.eq(
								option,
								_elm_lang$core$Basics$toString(dType));
						},
						_user$project$Knight_UV_Form$defenceUvs));
				var bonus = _elm_lang$core$List$head(
					A2(
						_elm_lang$core$List$filter,
						function (bType) {
							return _elm_lang$core$Native_Utils.eq(
								option,
								_elm_lang$core$Basics$toString(bType));
						},
						_user$project$Knight_UV_Form$weaponUvs));
				var uv = function () {
					var _p2 = bonus;
					if (_p2.ctor === 'Just') {
						return _user$project$Knight_UV$WeaponUV(
							{
								ctor: '_Tuple2',
								_0: _p2._0,
								_1: _user$project$Knight_UV_Form$uvStrength(equip)
							});
					} else {
						var _p3 = defence;
						if (_p3.ctor === 'Just') {
							return _user$project$Knight_UV$DefenceUV(
								{
									ctor: '_Tuple2',
									_0: _p3._0,
									_1: _user$project$Knight_UV_Form$uvStrength(equip)
								});
						} else {
							var _p4 = status;
							if (_p4.ctor === 'Just') {
								return _user$project$Knight_UV$StatusUV(
									{
										ctor: '_Tuple2',
										_0: _p4._0,
										_1: _user$project$Knight_UV_Form$uvStrength(equip)
									});
							} else {
								return _user$project$Knight_UV$StatusUV(
									{ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: _user$project$Knight_UV$Low});
							}
						}
					}
				}();
				return message(
					A3(_user$project$Util$replace, uvs, index, uv));
			});
		var swapStrength = F3(
			function (equip, index, value) {
				var strength = A2(
					_elm_lang$core$Maybe$withDefault,
					_user$project$Knight_UV$Low,
					A3(
						_elm_lang$core$Basics$flip,
						_user$project$Util$atIndex,
						uvStrengths,
						A2(
							_elm_lang$core$Result$withDefault,
							0,
							_elm_lang$core$String$toInt(value))));
				var uv = function () {
					var _p5 = equip;
					switch (_p5.ctor) {
						case 'WeaponUV':
							return _user$project$Knight_UV$WeaponUV(
								{ctor: '_Tuple2', _0: _p5._0._0, _1: strength});
						case 'DefenceUV':
							return _user$project$Knight_UV$DefenceUV(
								{ctor: '_Tuple2', _0: _p5._0._0, _1: strength});
						case 'StatusUV':
							return _user$project$Knight_UV$StatusUV(
								{ctor: '_Tuple2', _0: _p5._0._0, _1: strength});
						default:
							return _user$project$Knight_UV$Hearts(
								A2(
									F2(
										function (x, y) {
											return x + y;
										}),
									1,
									A2(
										_elm_lang$core$Maybe$withDefault,
										0,
										A2(_user$project$Util$index, strength, _user$project$Knight_UV_Form$strengths))));
					}
				}();
				return message(
					A3(_user$project$Util$replace, uvs, index, uv));
			});
		var addUv = function () {
			var excluded = A2(_elm_lang$core$List$map, _user$project$Knight_UV_Form$uvName, uvs);
			var uv = A2(
				_elm_lang$core$Maybe$withDefault,
				_user$project$Knight_UV$StatusUV(
					{ctor: '_Tuple2', _0: _user$project$Knight_Status$Fire, _1: _user$project$Knight_UV$NegMaximum}),
				_elm_lang$core$List$head(
					A2(
						_elm_lang$core$List$filter,
						function (uv) {
							return !A2(
								_elm_lang$core$List$member,
								_user$project$Knight_UV_Form$uvName(uv),
								excluded);
						},
						availableUvs)));
			return message(
				A2(
					_elm_lang$core$Basics_ops['++'],
					uvs,
					{
						ctor: '::',
						_0: uv,
						_1: {ctor: '[]'}
					}));
		}();
		var removeUv = function (index) {
			return message(
				A2(_user$project$Util$remove, index, uvs));
		};
		var uvNames = A2(_elm_lang$core$List$map, _user$project$Knight_UV_Form$uvName, availableUvs);
		var uvForm = F2(
			function (index, equip) {
				return {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('item sub'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$label,
								{ctor: '[]'},
								{
									ctor: '::',
									_0: _elm_lang$html$Html$text(
										A2(
											_elm_lang$core$Basics_ops['++'],
											'UV',
											_elm_lang$core$Basics$toString(index + 1))),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: A5(
									_user$project$View_Shortcuts$selectListExclude,
									A2(_elm_lang$core$List$map, _user$project$Knight_UV_Form$uvName, uvs),
									_elm_lang$core$Basics$identity,
									A2(swapType, equip, index),
									uvNames,
									_user$project$Knight_UV_Form$uvName(equip)),
								_1: {
									ctor: '::',
									_0: _user$project$View_Shortcuts$spacer,
									_1: {
										ctor: '::',
										_0: A2(
											_user$project$View_Shortcuts$button,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Events$onClick(
													removeUv(index)),
												_1: {ctor: '[]'}
											},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('-'),
												_1: {ctor: '[]'}
											}),
										_1: {ctor: '[]'}
									}
								}
							}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('item sub'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$label,
									{ctor: '[]'},
									{
										ctor: '::',
										_0: _elm_lang$html$Html$text(
											_elm_lang$core$Basics$toString(
												_user$project$Knight_UV_Form$uvStrength(equip))),
										_1: {ctor: '[]'}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$input,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$type_('range'),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$min('0'),
												_1: {
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$max('3'),
													_1: {
														ctor: '::',
														_0: _elm_lang$html$Html_Events$onInput(
															A2(swapStrength, equip, index)),
														_1: {
															ctor: '::',
															_0: _elm_lang$html$Html_Attributes$value(
																_elm_lang$core$Basics$toString(
																	A2(
																		_elm_lang$core$Maybe$withDefault,
																		0,
																		A3(
																			_elm_lang$core$Basics$flip,
																			_user$project$Util$index,
																			uvStrengths,
																			_user$project$Knight_UV_Form$uvStrength(equip))))),
															_1: {ctor: '[]'}
														}
													}
												}
											}
										},
										{ctor: '[]'}),
									_1: {ctor: '[]'}
								}
							}),
						_1: {ctor: '[]'}
					}
				};
			});
		return A2(
			_elm_lang$core$Basics_ops['++'],
			_elm_lang$core$List$concat(
				A2(_elm_lang$core$List$indexedMap, uvForm, uvs)),
			(_elm_lang$core$Native_Utils.cmp(
				_elm_lang$core$List$length(uvs),
				3) < 0) ? {
				ctor: '::',
				_0: A2(
					_user$project$View_Shortcuts$button,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(addUv),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('+ UV'),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			} : {ctor: '[]'});
	});
var _user$project$Knight_UV_Form$weaponForm = A2(
	_user$project$Knight_UV_Form$uvForms,
	_user$project$Knight_UV_Form$composedWeaponUvs,
	{
		ctor: '::',
		_0: _user$project$Knight_UV$Low,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$Medium,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$High,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_UV$VeryHigh,
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Knight_UV_Form$armourForm = A2(
	_user$project$Knight_UV_Form$uvForms,
	A2(_elm_lang$core$Basics_ops['++'], _user$project$Knight_UV_Form$composedDefenceUvs, _user$project$Knight_UV_Form$composedStatusUvs),
	{
		ctor: '::',
		_0: _user$project$Knight_UV$Low,
		_1: {
			ctor: '::',
			_0: _user$project$Knight_UV$Medium,
			_1: {
				ctor: '::',
				_0: _user$project$Knight_UV$High,
				_1: {
					ctor: '::',
					_0: _user$project$Knight_UV$Maximum,
					_1: {ctor: '[]'}
				}
			}
		}
	});

var _user$project$Knight_Form$form = F4(
	function (loadouts, save, equip, knight) {
		var padNum = function (num) {
			return A3(
				_elm_lang$core$String$padLeft,
				2,
				_elm_lang$core$Native_Utils.chr(' '),
				_elm_lang$core$Basics$toString(num));
		};
		var slot = F5(
			function (message, equipment, items, title, uvForm) {
				var equipUv = function (uvs) {
					return message(
						_elm_lang$core$Native_Utils.update(
							equipment,
							{uvs: uvs}));
				};
				var equipPiece = function (piece) {
					return message(
						_elm_lang$core$Native_Utils.update(
							equipment,
							{piece: piece}));
				};
				return A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('slot'),
						_1: {ctor: '[]'}
					},
					A2(
						_elm_lang$core$Basics_ops['++'],
						{
							ctor: '::',
							_0: A2(
								_user$project$View_Shortcuts$item,
								title,
								A4(
									_user$project$View_Shortcuts$selectList,
									function (_) {
										return _.name;
									},
									equipPiece,
									items,
									equipment.piece)),
							_1: {ctor: '[]'}
						},
						A2(uvForm, equipUv, equipment)));
			});
		var weaponSlots = F2(
			function (message, knight) {
				var removeWeapon = function (index) {
					return message(
						A2(_user$project$Util$remove, index, knight.weapons));
				};
				var addWeapon = message(
					A2(
						_elm_lang$core$Basics_ops['++'],
						knight.weapons,
						{
							ctor: '::',
							_0: {
								piece: _user$project$Knight_Bombs$nitro,
								uvs: {ctor: '[]'}
							},
							_1: {ctor: '[]'}
						}));
				var equipWeapon = F2(
					function (index, weapon) {
						return message(
							A3(_user$project$Util$replace, knight.weapons, index, weapon));
					});
				var weaponSlot = F2(
					function (index, weapon) {
						return A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('weapon slot'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A5(
									slot,
									equipWeapon(index),
									weapon,
									_user$project$Knight$weapons,
									A2(
										_elm_lang$core$Basics_ops['++'],
										'Weapon ',
										_elm_lang$core$Basics$toString(index + 1)),
									_user$project$Knight_UV_Form$weaponForm),
								_1: (_elm_lang$core$Native_Utils.cmp(index, 1) > 0) ? {
									ctor: '::',
									_0: A2(
										_user$project$View_Shortcuts$button,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Events$onClick(
												removeWeapon(index)),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text('-'),
											_1: {ctor: '[]'}
										}),
									_1: {ctor: '[]'}
								} : {ctor: '[]'}
							});
					});
				return A2(
					_elm_lang$core$Basics_ops['++'],
					A2(_elm_lang$core$List$indexedMap, weaponSlot, knight.weapons),
					(_elm_lang$core$Native_Utils.cmp(
						_elm_lang$core$List$length(knight.weapons),
						4) < 0) ? {
						ctor: '::',
						_0: A2(
							_user$project$View_Shortcuts$button,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(addWeapon),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('+ Weapon'),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					} : {ctor: '[]'});
			});
		var equipLoadout = function (_p0) {
			var _p1 = _p0;
			var rename = function (knight) {
				return _elm_lang$core$Native_Utils.update(
					knight,
					{name: _p1._0});
			};
			var loaded = A2(
				_elm_lang$core$Maybe$withDefault,
				knight,
				A2(
					_elm_lang$core$Maybe$map,
					rename,
					_user$project$Knight_Encode$decode(_p1._1)));
			return equip(loaded);
		};
		var equipVita = function (slot) {
			return equip(
				_elm_lang$core$Native_Utils.update(
					knight,
					{vita: slot}));
		};
		var equipTrinkets = function (slot) {
			return equip(
				_elm_lang$core$Native_Utils.update(
					knight,
					{trinkets: slot}));
		};
		var equipWeapons = function (slot) {
			return equip(
				_elm_lang$core$Native_Utils.update(
					knight,
					{weapons: slot}));
		};
		var equipArmour = function (slot) {
			return equip(
				_elm_lang$core$Native_Utils.update(
					knight,
					{armour: slot}));
		};
		var equipHelmet = function (slot) {
			return equip(
				_elm_lang$core$Native_Utils.update(
					knight,
					{helmet: slot}));
		};
		var equipShield = function (slot) {
			return equip(
				_elm_lang$core$Native_Utils.update(
					knight,
					{shield: slot}));
		};
		var rename = function (name) {
			return equip(
				_elm_lang$core$Native_Utils.update(
					knight,
					{name: name}));
		};
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('knight-form'),
				_1: {ctor: '[]'}
			},
			A2(
				_elm_lang$core$Basics_ops['++'],
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$input,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$type_('text'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$value(knight.name),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Events$onInput(rename),
									_1: {ctor: '[]'}
								}
							}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('button'),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Events$onClick(
										save(
											{
												ctor: '_Tuple2',
												_0: knight.name,
												_1: _user$project$Knight_Encode$encode(knight)
											})),
									_1: {ctor: '[]'}
								}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text('Save Loadout'),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_user$project$View_Shortcuts$item,
								'Loadout',
								A4(
									_user$project$View_Shortcuts$selectList,
									_elm_lang$core$Tuple$first,
									equipLoadout,
									loadouts,
									{
										ctor: '_Tuple2',
										_0: knight.name,
										_1: _user$project$Knight_Encode$encode(knight)
									})),
							_1: {
								ctor: '::',
								_0: _user$project$View_Shortcuts$divisor,
								_1: {
									ctor: '::',
									_0: A5(slot, equipShield, knight.shield, _user$project$Knight_Shield$shields, 'Shield', _user$project$Knight_UV_Form$armourForm),
									_1: {
										ctor: '::',
										_0: _user$project$View_Shortcuts$divisor,
										_1: {
											ctor: '::',
											_0: A5(slot, equipHelmet, knight.helmet, _user$project$Knight_Armour$armours, 'Helmet', _user$project$Knight_UV_Form$armourForm),
											_1: {
												ctor: '::',
												_0: A5(slot, equipArmour, knight.armour, _user$project$Knight_Armour$armours, 'Armour', _user$project$Knight_UV_Form$armourForm),
												_1: {
													ctor: '::',
													_0: _user$project$View_Shortcuts$divisor,
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				},
				A2(
					_elm_lang$core$Basics_ops['++'],
					A2(weaponSlots, equipWeapons, knight),
					A2(
						_elm_lang$core$Basics_ops['++'],
						{
							ctor: '::',
							_0: _user$project$View_Shortcuts$divisor,
							_1: A2(_user$project$Knight_UV_Form$trinketForms, equipTrinkets, knight.trinkets)
						},
						{
							ctor: '::',
							_0: _user$project$View_Shortcuts$divisor,
							_1: {
								ctor: '::',
								_0: A2(
									_user$project$View_Shortcuts$item,
									'Vita',
									A4(
										_user$project$View_Shortcuts$selectList,
										padNum,
										equipVita,
										A2(_elm_lang$core$List$range, 0, 21),
										knight.vita)),
								_1: {ctor: '[]'}
							}
						}))));
	});

var _user$project$Knight_Stats$chargeSpeed = F2(
	function (knight, weapon) {
		var speed = A2(_user$project$Knight$chargeSpeed, knight, weapon);
		var maxTime = 8;
		var minTime = 0.55;
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('row graphic'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A3(_user$project$View_Shortcuts$bar, maxTime - minTime, '', maxTime - speed),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('value'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(
								A2(
									_elm_lang$core$Basics_ops['++'],
									_user$project$Util$pretty(speed),
									's')),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Knight_Stats$highlightPips = F3(
	function (highlights, klass, amount) {
		var description = function (tuple) {
			var _p0 = tuple;
			if (_p0.ctor === 'Just') {
				return _p0._0._1;
			} else {
				return '';
			}
		};
		var pip = function (i) {
			var highlight = description(
				_elm_lang$core$List$head(
					A2(
						_elm_lang$core$List$filter,
						function (_p1) {
							var _p2 = _p1;
							return _elm_lang$core$Native_Utils.eq(_p2._0, i);
						},
						highlights)));
			var isHighlight = A2(
				_elm_lang$core$List$member,
				i,
				A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, highlights));
			return A2(
				_elm_lang$html$Html$div,
				A2(
					_elm_lang$core$Basics_ops['++'],
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class(
							A2(
								_elm_lang$core$Basics_ops['++'],
								'pip',
								isHighlight ? ' highlight' : '')),
						_1: {ctor: '[]'}
					},
					isHighlight ? {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$title(highlight),
						_1: {ctor: '[]'}
					} : {ctor: '[]'}),
				{ctor: '[]'});
		};
		var n = _elm_lang$core$Basics$truncate(amount);
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class(
					A2(_elm_lang$core$Basics_ops['++'], 'graphic pips ', klass)),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('graphic negative'),
						_1: {ctor: '[]'}
					},
					A2(
						_elm_lang$core$List$map,
						pip,
						A2(_elm_lang$core$List$range, n, -1))),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('hdivisor'),
							_1: {ctor: '[]'}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('graphic positive'),
								_1: {ctor: '[]'}
							},
							A2(
								_elm_lang$core$List$map,
								pip,
								A2(_elm_lang$core$List$range, 1, n))),
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _user$project$Knight_Stats$pips = _user$project$Knight_Stats$highlightPips(
	{ctor: '[]'});
var _user$project$Knight_Stats$mobility = function (knight) {
	var speed = _user$project$Knight$mobility(knight);
	var maxMobility = 130;
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('row graphic'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_user$project$Knight_Stats$pips,
				'speed',
				(_elm_lang$core$Basics$toFloat(speed) - 100) / 4),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('value'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(
							A2(
								_elm_lang$core$Basics_ops['++'],
								_elm_lang$core$Basics$toString(speed),
								'%')),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Knight_Stats$attackSpeed = F2(
	function (knight, weapon) {
		var speed = A2(_user$project$Knight$attackSpeed, knight, weapon);
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('row graphic'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_user$project$Knight_Stats$pips,
					'speed',
					(_elm_lang$core$Basics$toFloat(speed) - 100) / 4),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('value'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(
								A2(
									_elm_lang$core$Basics_ops['++'],
									_elm_lang$core$Basics$toString(speed),
									'%')),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Knight_Stats$resistances = function (knight) {
	var immunities = function (status) {
		return {
			ctor: '::',
			_0: _elm_lang$core$Native_Utils.eq(status, _user$project$Knight_Status$Curse) ? {ctor: '_Tuple2', _0: 10, _1: 'Immune to Faust\'s self-curse (but not Gran Faust)'} : {
				ctor: '_Tuple2',
				_0: 7,
				_1: A2(
					_elm_lang$core$Basics_ops['++'],
					'Immune to Minor ',
					_elm_lang$core$Basics$toString(status))
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 9,
					_1: A2(
						_elm_lang$core$Basics_ops['++'],
						'Immune to Moderate ',
						_elm_lang$core$Basics$toString(status))
				},
				_1: {ctor: '[]'}
			}
		};
	};
	var sign = function (amount) {
		return (_elm_lang$core$Native_Utils.cmp(amount, 0) > 0) ? '+' : '';
	};
	var resistance = function (_p3) {
		var _p4 = _p3;
		var _p6 = _p4._0;
		var _p5 = _p4._1;
		return A2(
			_user$project$View_Shortcuts$item,
			_elm_lang$core$Basics$toString(_p6),
			A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('graphic'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A3(
						_user$project$Knight_Stats$highlightPips,
						immunities(_p6),
						_elm_lang$core$Basics$toString(_p6),
						_p5),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('value'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(
									A2(
										_elm_lang$core$Basics_ops['++'],
										sign(_p5),
										_elm_lang$core$Basics$toString(_p5))),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}
				}));
	};
	return A2(
		_elm_lang$core$List$map,
		resistance,
		_user$project$Knight$resistances(knight));
};
var _user$project$Knight_Stats$stats = F5(
	function (message, side, left, right, events) {
		var trigger = F2(
			function (label, event) {
				var _p7 = message;
				if (_p7.ctor === 'Just') {
					return A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('button'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(
									_p7._0(event)),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: _elm_lang$html$Html$text(label),
							_1: {ctor: '[]'}
						});
				} else {
					return A2(
						_elm_lang$html$Html$div,
						{ctor: '[]'},
						{ctor: '[]'});
				}
			});
		var statusDescriptor = F2(
			function (maybeStatus, maybeInfliction) {
				var _p8 = maybeStatus;
				if (_p8.ctor === 'Just') {
					var _p12 = _p8._0;
					var _p9 = maybeInfliction;
					if (_p9.ctor === 'Just') {
						var _p11 = _p9._0._1;
						return {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('status-blurb'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$html$Html$span,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$class('chance'),
											_1: {ctor: '[]'}
										},
										{
											ctor: '::',
											_0: _elm_lang$html$Html$text(
												A2(
													_elm_lang$core$Basics_ops['++'],
													_elm_lang$core$Basics$toString(
														_user$project$Knight_Types$statusChance(_p9._0._0)),
													'%')),
											_1: {ctor: '[]'}
										}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$html$Html$span,
											{ctor: '[]'},
											{
												ctor: '::',
												_0: _elm_lang$html$Html$text('chance of'),
												_1: {ctor: '[]'}
											}),
										_1: {
											ctor: '::',
											_0: _elm_lang$core$Native_Utils.eq(_p12, _user$project$Knight_Status$Deathmark) ? A2(
												_elm_lang$html$Html$span,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(' '),
													_1: {ctor: '[]'}
												}) : A2(
												_elm_lang$html$Html$span,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('strength'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(
														A2(
															_elm_lang$core$Basics_ops['++'],
															'+',
															_elm_lang$core$Basics$toString(
																_user$project$Knight_Types$statusStrength(_p11)))),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: function () {
													var _p10 = message;
													if (_p10.ctor === 'Just') {
														return A2(
															_elm_lang$html$Html$div,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$class('button'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$html$Html_Events$onClick(
																		_p10._0(
																			_user$project$Events$Infliction(
																				{ctor: '_Tuple2', _0: _p12, _1: _p11}))),
																	_1: {ctor: '[]'}
																}
															},
															{
																ctor: '::',
																_0: _user$project$View_Shortcuts$toText(_p12),
																_1: {ctor: '[]'}
															});
													} else {
														return A2(
															_elm_lang$html$Html$span,
															{
																ctor: '::',
																_0: _elm_lang$html$Html_Attributes$class(
																	A2(
																		_elm_lang$core$Basics_ops['++'],
																		'status ',
																		_elm_lang$core$Basics$toString(_p12))),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: _elm_lang$html$Html$text(
																	_elm_lang$core$Basics$toString(_p12)),
																_1: {ctor: '[]'}
															});
													}
												}(),
												_1: {ctor: '[]'}
											}
										}
									}
								}),
							_1: {ctor: '[]'}
						};
					} else {
						return {ctor: '[]'};
					}
				} else {
					return {ctor: '[]'};
				}
			});
		var lockdown = !_elm_lang$core$Native_Utils.eq(message, _elm_lang$core$Maybe$Nothing);
		var opponent = _elm_lang$core$Native_Utils.eq(side, _user$project$Events$Left) ? right : left;
		var opposing = _elm_lang$core$Native_Utils.eq(side, _user$project$Events$Left) ? _user$project$Events$Right : _user$project$Events$Left;
		var inflictions = function () {
			var inflictionDetail = function (_p13) {
				var _p14 = _p13;
				var _p15 = _p14._0;
				return A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('item'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							trigger,
							'Recover',
							_user$project$Events$Recovery(_p15)),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class(
										A2(
											_elm_lang$core$Basics_ops['++'],
											'status ',
											_elm_lang$core$Basics$toString(_p15))),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: _user$project$View_Shortcuts$toText(_p15),
									_1: {ctor: '[]'}
								}),
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Native_Utils.eq(_p15, _user$project$Knight_Status$Deathmark) ? A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('value'),
										_1: {ctor: '[]'}
									},
									{ctor: '[]'}) : A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('value'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _user$project$View_Shortcuts$toText(_p14._1),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}
						}
					});
			};
			return A2(
				_elm_lang$core$List$map,
				inflictionDetail,
				A4(_user$project$Events$statuses, opposing, left, right, events));
		}();
		var knight = _elm_lang$core$Native_Utils.eq(side, _user$project$Events$Left) ? left : right;
		var health = function () {
			var health = _user$project$Knight$health(knight);
			var damage = A5(_user$project$Events$totalDamage, lockdown, opposing, left, right, events);
			var remaining = health - _elm_lang$core$Basics$ceiling(damage);
			var remainingHearts = (remaining / 40) | 0;
			var hearts = _user$project$Knight$hearts(knight);
			var golds = (_elm_lang$core$Native_Utils.cmp(hearts, 60) > 0) ? (hearts - 60) : 0;
			var silvers = (_elm_lang$core$Native_Utils.cmp(golds, 0) > 0) ? 30 : ((_elm_lang$core$Native_Utils.cmp(hearts, 30) > 0) ? (hearts - 30) : 0);
			var heart = function (n) {
				var border = (_elm_lang$core$Native_Utils.cmp(golds, n) > -1) ? 'gold-border' : ((_elm_lang$core$Native_Utils.cmp(silvers, n) > -1) ? 'silver-border' : 'red-border');
				var fill = (_elm_lang$core$Native_Utils.cmp(remainingHearts, n) < 0) ? 'empty' : ((_elm_lang$core$Native_Utils.cmp(remainingHearts, 30 + n) < 0) ? 'red' : ((_elm_lang$core$Native_Utils.cmp(remainingHearts, 60 + n) < 0) ? 'silver' : 'gold'));
				return A2(
					_elm_lang$html$Html$span,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class(
							A2(
								_elm_lang$core$Basics_ops['++'],
								fill,
								A2(_elm_lang$core$Basics_ops['++'], ' heart ', border))),
						_1: {ctor: '[]'}
					},
					{ctor: '[]'});
			};
			var reds = (_elm_lang$core$Native_Utils.cmp(silvers, 0) > 0) ? 30 : hearts;
			return A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('row'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('hearts'),
							_1: {ctor: '[]'}
						},
						A2(
							_elm_lang$core$List$map,
							heart,
							A2(_elm_lang$core$List$range, 1, reds))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('value'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: _user$project$View_Shortcuts$toText(
									A2(
										_elm_lang$core$Basics$min,
										health,
										A2(_elm_lang$core$Basics$max, 0, remaining))),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					}
				});
		}();
		var attacks = function (weapon) {
			var value = function (label) {
				return A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('value'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text(label),
						_1: {ctor: '[]'}
					});
			};
			var maxDamage = 715;
			var bar = function (dType) {
				return A2(
					_user$project$View_Shortcuts$bar,
					maxDamage,
					_elm_lang$core$Basics$toString(dType));
			};
			var piece = weapon.piece;
			var singlebar = function (damage) {
				return A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('splitbar'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(bar, piece.damageType, damage),
						_1: {ctor: '[]'}
					});
			};
			var splitbar = function (damage) {
				return A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('splitbar'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(bar, piece.damageType, damage / 2),
						_1: {
							ctor: '::',
							_0: A2(bar, piece.split, damage / 2),
							_1: {ctor: '[]'}
						}
					});
			};
			var split = !_elm_lang$core$Native_Utils.eq(piece.split, _elm_lang$core$Maybe$Nothing);
			var attack = F2(
				function (index, _p16) {
					var _p17 = _p16;
					var _p19 = _p17._0._0;
					var modifier = A4(_user$project$Events$attackModifier, opposing, left, right, events);
					var dmg = _p17._0._1 * modifier;
					return A2(
						_elm_lang$core$Basics_ops['++'],
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$div,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('item '),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: function () {
										var _p18 = message;
										if (_p18.ctor === 'Just') {
											return A2(
												_elm_lang$html$Html$label,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Events$onClick(
														_p18._0(
															_user$project$Events$Attack(
																{ctor: '_Tuple2', _0: piece.name, _1: _p19}))),
													_1: {
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$class('button'),
														_1: {ctor: '[]'}
													}
												},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(
														_elm_lang$core$Basics$toString(_p19)),
													_1: {ctor: '[]'}
												});
										} else {
											return A2(
												_elm_lang$html$Html$label,
												{ctor: '[]'},
												{
													ctor: '::',
													_0: _elm_lang$html$Html$text(
														_elm_lang$core$Basics$toString(_p19)),
													_1: {ctor: '[]'}
												});
										}
									}(),
									_1: split ? {
										ctor: '::',
										_0: splitbar(dmg),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$html$Html$div,
												{
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$class('split-value'),
													_1: {ctor: '[]'}
												},
												{
													ctor: '::',
													_0: value(
														A2(
															_elm_lang$core$Basics_ops['++'],
															_elm_lang$core$Basics$toString(
																_elm_lang$core$Basics$ceiling(dmg / 2)),
															' +')),
													_1: {
														ctor: '::',
														_0: value(
															_elm_lang$core$Basics$toString(
																_elm_lang$core$Basics$ceiling(dmg / 2))),
														_1: {ctor: '[]'}
													}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$html$Html$div,
													{
														ctor: '::',
														_0: _elm_lang$html$Html_Attributes$class('combined-value'),
														_1: {ctor: '[]'}
													},
													{
														ctor: '::',
														_0: value(
															_elm_lang$core$Basics$toString(
																_elm_lang$core$Basics$ceiling(dmg))),
														_1: {ctor: '[]'}
													}),
												_1: {ctor: '[]'}
											}
										}
									} : {
										ctor: '::',
										_0: singlebar(dmg),
										_1: {
											ctor: '::',
											_0: value(
												_elm_lang$core$Basics$toString(
													_elm_lang$core$Basics$ceiling(dmg))),
											_1: {ctor: '[]'}
										}
									}
								}),
							_1: {ctor: '[]'}
						},
						A2(statusDescriptor, piece.status, _p17._1));
				});
			return A2(
				_elm_lang$core$Basics_ops['++'],
				{
					ctor: '::',
					_0: _user$project$View_Shortcuts$divisor,
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h3,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(piece.name),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_user$project$View_Shortcuts$item,
								'Speed',
								A2(_user$project$Knight_Stats$attackSpeed, knight, weapon)),
							_1: {
								ctor: '::',
								_0: A2(
									_user$project$View_Shortcuts$item,
									'CT',
									A2(_user$project$Knight_Stats$chargeSpeed, knight, weapon)),
								_1: {ctor: '[]'}
							}
						}
					}
				},
				_elm_lang$core$List$concat(
					A2(
						_elm_lang$core$List$indexedMap,
						attack,
						A2(_user$project$Knight$attacks, knight, weapon))));
		};
		var shield = function () {
			var piece = knight.shield.piece;
			return A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('item'),
					_1: {ctor: '[]'}
				},
				A2(
					_elm_lang$core$Basics_ops['++'],
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$h3,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(piece.name),
								_1: {ctor: '[]'}
							}),
						_1: {ctor: '[]'}
					},
					_elm_lang$core$Native_Utils.eq(piece, _user$project$Knight_Shield$recon) ? A2(
						statusDescriptor,
						_elm_lang$core$Maybe$Just(_user$project$Knight_Status$Deathmark),
						_elm_lang$core$Maybe$Just(
							{ctor: '_Tuple2', _0: _user$project$Knight_Types$Certain, _1: _user$project$Knight_Types$Ultimate})) : {ctor: '[]'}));
		}();
		var defences = function () {
			var modifier = A4(_user$project$Events$defenceModifier, opposing, left, right, events);
			var maxDefence = 350;
			var defence = function (_p20) {
				var _p21 = _p20;
				var _p23 = _p21._0;
				var _p22 = _p21._1;
				return A2(
					_user$project$View_Shortcuts$item,
					_elm_lang$core$Basics$toString(_p23),
					A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('graphic'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A3(
								_user$project$View_Shortcuts$bar,
								maxDefence,
								_elm_lang$core$Basics$toString(_p23),
								_p22 * modifier),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$html$Html$div,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('value'),
										_1: {ctor: '[]'}
									},
									{
										ctor: '::',
										_0: _user$project$View_Shortcuts$toText(
											_elm_lang$core$Basics$round(_p22 * modifier)),
										_1: {ctor: '[]'}
									}),
								_1: {ctor: '[]'}
							}
						}));
			};
			return A2(
				_elm_lang$core$List$map,
				defence,
				A2(_user$project$Knight$defences, lockdown, knight));
		}();
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('knight-stats'),
				_1: {ctor: '[]'}
			},
			_elm_lang$core$List$concat(
				{
					ctor: '::',
					_0: inflictions,
					_1: {
						ctor: '::',
						_0: {
							ctor: '::',
							_0: _user$project$View_Shortcuts$divisor,
							_1: {
								ctor: '::',
								_0: A2(_user$project$View_Shortcuts$item, 'Health', health),
								_1: {
									ctor: '::',
									_0: A2(
										_user$project$View_Shortcuts$item,
										'Mobility',
										_user$project$Knight_Stats$mobility(knight)),
									_1: {
										ctor: '::',
										_0: _user$project$View_Shortcuts$divisor,
										_1: {ctor: '[]'}
									}
								}
							}
						},
						_1: {
							ctor: '::',
							_0: defences,
							_1: {
								ctor: '::',
								_0: {
									ctor: '::',
									_0: _user$project$View_Shortcuts$divisor,
									_1: {ctor: '[]'}
								},
								_1: {
									ctor: '::',
									_0: _user$project$Knight_Stats$resistances(knight),
									_1: {
										ctor: '::',
										_0: {
											ctor: '::',
											_0: _user$project$View_Shortcuts$divisor,
											_1: {
												ctor: '::',
												_0: shield,
												_1: {ctor: '[]'}
											}
										},
										_1: {
											ctor: '::',
											_0: _elm_lang$core$List$concat(
												A2(_elm_lang$core$List$map, attacks, knight.weapons)),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}));
	});

var _user$project$LocalStorage$lsSave = _elm_lang$core$Native_Platform.outgoingPort(
	'lsSave',
	function (v) {
		return _elm_lang$core$Native_List.toArray(v).map(
			function (v) {
				return [v._0, v._1];
			});
	});
var _user$project$LocalStorage$lsData = _elm_lang$core$Native_Platform.incomingPort(
	'lsData',
	_elm_lang$core$Json_Decode$list(
		A2(
			_elm_lang$core$Json_Decode$andThen,
			function (x0) {
				return A2(
					_elm_lang$core$Json_Decode$andThen,
					function (x1) {
						return _elm_lang$core$Json_Decode$succeed(
							{ctor: '_Tuple2', _0: x0, _1: x1});
					},
					A2(_elm_lang$core$Json_Decode$index, 1, _elm_lang$core$Json_Decode$string));
			},
			A2(_elm_lang$core$Json_Decode$index, 0, _elm_lang$core$Json_Decode$string))));

var _user$project$Main$update = F2(
	function (msg, model) {
		var cmd = function () {
			var _p0 = msg;
			_v0_3:
			do {
				switch (_p0.ctor) {
					case 'SaveLoadout':
						if (_p0._0.ctor === '_Tuple2') {
							return _user$project$LocalStorage$lsSave(
								{
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: A2(_elm_lang$core$Basics_ops['++'], 'loadout|', _p0._0._0),
										_1: _p0._0._1
									},
									_1: {ctor: '[]'}
								});
						} else {
							break _v0_3;
						}
					case 'EquipLeft':
						var _p1 = _p0._0;
						return _user$project$LocalStorage$lsSave(
							{
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'leftName', _1: _p1.name},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'left',
										_1: _user$project$Knight_Encode$encode(_p1)
									},
									_1: {ctor: '[]'}
								}
							});
					case 'EquipRight':
						var _p2 = _p0._0;
						return _user$project$LocalStorage$lsSave(
							{
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'rightName', _1: _p2.name},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'right',
										_1: _user$project$Knight_Encode$encode(_p2)
									},
									_1: {ctor: '[]'}
								}
							});
					default:
						break _v0_3;
				}
			} while(false);
			return _elm_lang$core$Platform_Cmd$none;
		}();
		var next = function () {
			var _p3 = msg;
			switch (_p3.ctor) {
				case 'EquipLeft':
					return _elm_lang$core$Native_Utils.update(
						model,
						{left: _p3._0});
				case 'EquipRight':
					return _elm_lang$core$Native_Utils.update(
						model,
						{right: _p3._0});
				case 'SetEvents':
					return _elm_lang$core$Native_Utils.update(
						model,
						{events: _p3._0});
				case 'SetState':
					return _elm_lang$core$Native_Utils.update(
						model,
						{state: _p3._0});
				case 'Loadouts':
					var $new = A2(
						_elm_lang$core$List$map,
						function (_p4) {
							var _p5 = _p4;
							return {
								ctor: '_Tuple2',
								_0: A2(_elm_lang$core$String$dropLeft, 8, _p5._0),
								_1: _p5._1
							};
						},
						A2(
							_elm_lang$core$List$filter,
							function (_p6) {
								var _p7 = _p6;
								return A2(_elm_lang$core$String$startsWith, 'loadout|', _p7._0);
							},
							_p3._0));
					return _elm_lang$core$Native_Utils.update(
						model,
						{loadouts: $new});
				default:
					return model;
			}
		}();
		return {ctor: '_Tuple2', _0: next, _1: cmd};
	});
var _user$project$Main$Flags = F6(
	function (a, b, c, d, e, f) {
		return {qs: a, path: b, left: c, leftName: d, right: e, rightName: f};
	});
var _user$project$Main$Model = F6(
	function (a, b, c, d, e, f) {
		return {path: a, left: b, right: c, state: d, events: e, loadouts: f};
	});
var _user$project$Main$SaveLoadout = function (a) {
	return {ctor: 'SaveLoadout', _0: a};
};
var _user$project$Main$Loadouts = function (a) {
	return {ctor: 'Loadouts', _0: a};
};
var _user$project$Main$subscriptions = function (model) {
	return _user$project$LocalStorage$lsData(_user$project$Main$Loadouts);
};
var _user$project$Main$SetEvents = function (a) {
	return {ctor: 'SetEvents', _0: a};
};
var _user$project$Main$SetState = function (a) {
	return {ctor: 'SetState', _0: a};
};
var _user$project$Main$EquipRight = function (a) {
	return {ctor: 'EquipRight', _0: a};
};
var _user$project$Main$EquipLeft = function (a) {
	return {ctor: 'EquipLeft', _0: a};
};
var _user$project$Main$Vs = {ctor: 'Vs'};
var _user$project$Main$init = function (flags) {
	var readName = function (attr) {
		return A2(
			_elm_lang$core$Maybe$map,
			_elm_lang$core$Result$withDefault('Decoded'),
			A2(
				_elm_lang$core$Maybe$map,
				_truqu$elm_base64$Base64$decode,
				A2(_user$project$Util$queryValue, flags.qs, attr)));
	};
	var leftName = A2(
		_elm_lang$core$Maybe$withDefault,
		'Left',
		A2(
			_user$project$Util$orMaybe,
			flags.leftName,
			readName('leftname')));
	var rightName = A2(
		_elm_lang$core$Maybe$withDefault,
		'Right',
		A2(
			_user$project$Util$orMaybe,
			flags.rightName,
			readName('rightname')));
	var rename = F2(
		function (name, knight) {
			return _elm_lang$core$Native_Utils.update(
				knight,
				{name: name});
		});
	var left = A2(
		_elm_lang$core$Maybe$withDefault,
		_user$project$Knight$you,
		A2(
			_elm_lang$core$Maybe$map,
			rename(leftName),
			A2(
				_user$project$Util$orMaybe,
				_user$project$Knight_Encode$decode(flags.left),
				A2(
					_elm_lang$core$Maybe$andThen,
					_user$project$Knight_Encode$decode,
					A2(_user$project$Util$queryValue, flags.qs, 'left')))));
	var right = A2(
		_elm_lang$core$Maybe$withDefault,
		_user$project$Knight$opponent,
		A2(
			_elm_lang$core$Maybe$map,
			rename(rightName),
			A2(
				_user$project$Util$orMaybe,
				_user$project$Knight_Encode$decode(flags.right),
				A2(
					_elm_lang$core$Maybe$andThen,
					_user$project$Knight_Encode$decode,
					A2(_user$project$Util$queryValue, flags.qs, 'right')))));
	var model = {
		path: flags.path,
		left: left,
		right: right,
		state: _user$project$Main$Vs,
		events: {ctor: '[]'},
		loadouts: {ctor: '[]'}
	};
	return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
};
var _user$project$Main$Opponent = {ctor: 'Opponent'};
var _user$project$Main$You = {ctor: 'You'};
var _user$project$Main$view = function (model) {
	var buttonText = _elm_lang$core$Native_Utils.eq(model.state, _user$project$Main$Vs) ? 'Share Duel' : 'Share Loadout';
	var right = {
		ctor: '::',
		_0: {
			ctor: '_Tuple2',
			_0: 'right',
			_1: _user$project$Knight_Encode$encode(model.right)
		},
		_1: {
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'rightname',
				_1: _user$project$Util$btoa(model.right.name)
			},
			_1: {ctor: '[]'}
		}
	};
	var left = {
		ctor: '::',
		_0: {
			ctor: '_Tuple2',
			_0: 'left',
			_1: _user$project$Knight_Encode$encode(model.left)
		},
		_1: {
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'leftname',
				_1: _user$project$Util$btoa(model.left.name)
			},
			_1: {ctor: '[]'}
		}
	};
	var shareData = function () {
		var _p8 = model.state;
		switch (_p8.ctor) {
			case 'You':
				return left;
			case 'Vs':
				return A2(_elm_lang$core$Basics_ops['++'], left, right);
			default:
				return right;
		}
	}();
	var rightEvents = model.events;
	var leftEvents = model.events;
	var addEvent = F2(
		function (side, event) {
			return _user$project$Main$SetEvents(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: side, _1: event},
					_1: model.events
				});
		});
	var stateToLabel = function (state) {
		var _p9 = state;
		switch (_p9.ctor) {
			case 'You':
				return model.left.name;
			case 'Vs':
				return 'vs';
			default:
				return model.right.name;
		}
	};
	return A2(
		_elm_lang$html$Html$div,
		{
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('body'),
			_1: {ctor: '[]'}
		},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$html$Html$div,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('state-tabs'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A5(
						_user$project$View_Shortcuts$tabs,
						stateToLabel,
						_elm_lang$core$Basics$toString,
						_user$project$Main$SetState,
						{
							ctor: '::',
							_0: _user$project$Main$You,
							_1: {
								ctor: '::',
								_0: _user$project$Main$Vs,
								_1: {
									ctor: '::',
									_0: _user$project$Main$Opponent,
									_1: {ctor: '[]'}
								}
							}
						},
						model.state),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$div,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('state-url'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$html$Html$div,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$class('button clipboard'),
								_1: {
									ctor: '::',
									_0: A2(_elm_lang$html$Html_Attributes$attribute, 'data-clipboard-target', '#url'),
									_1: {ctor: '[]'}
								}
							},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(buttonText),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$input,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$id('url'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$class('url'),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$readonly(true),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$value(
													A2(
														_elm_lang$core$Basics_ops['++'],
														model.path,
														A2(
															_elm_lang$core$Basics_ops['++'],
															'?',
															_user$project$Util$querify(shareData)))),
												_1: {ctor: '[]'}
											}
										}
									}
								},
								{ctor: '[]'}),
							_1: {ctor: '[]'}
						}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$div,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class(
								A2(
									_elm_lang$core$Basics_ops['++'],
									'main ',
									_elm_lang$core$Basics$toString(model.state))),
							_1: {ctor: '[]'}
						},
						function () {
							var _p10 = model.state;
							switch (_p10.ctor) {
								case 'You':
									return {
										ctor: '::',
										_0: A4(_user$project$Knight_Form$form, model.loadouts, _user$project$Main$SaveLoadout, _user$project$Main$EquipLeft, model.left),
										_1: {
											ctor: '::',
											_0: A5(
												_user$project$Knight_Stats$stats,
												_elm_lang$core$Maybe$Nothing,
												_user$project$Events$Left,
												model.left,
												model.right,
												{ctor: '[]'}),
											_1: {ctor: '[]'}
										}
									};
								case 'Vs':
									return {
										ctor: '::',
										_0: A5(
											_user$project$Knight_Stats$stats,
											_elm_lang$core$Maybe$Just(
												addEvent(_user$project$Events$Left)),
											_user$project$Events$Left,
											model.left,
											model.right,
											model.events),
										_1: {
											ctor: '::',
											_0: A4(_user$project$Events_View$log, _user$project$Main$SetEvents, model.events, model.left, model.right),
											_1: {
												ctor: '::',
												_0: A5(
													_user$project$Knight_Stats$stats,
													_elm_lang$core$Maybe$Just(
														addEvent(_user$project$Events$Right)),
													_user$project$Events$Right,
													model.left,
													model.right,
													model.events),
												_1: {ctor: '[]'}
											}
										}
									};
								default:
									return {
										ctor: '::',
										_0: A5(
											_user$project$Knight_Stats$stats,
											_elm_lang$core$Maybe$Nothing,
											_user$project$Events$Right,
											model.left,
											model.right,
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A4(_user$project$Knight_Form$form, model.loadouts, _user$project$Main$SaveLoadout, _user$project$Main$EquipRight, model.right),
											_1: {ctor: '[]'}
										}
									};
							}
						}()),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$Main$main = _elm_lang$html$Html$programWithFlags(
	{init: _user$project$Main$init, view: _user$project$Main$view, update: _user$project$Main$update, subscriptions: _user$project$Main$subscriptions})(
	A2(
		_elm_lang$core$Json_Decode$andThen,
		function (left) {
			return A2(
				_elm_lang$core$Json_Decode$andThen,
				function (leftName) {
					return A2(
						_elm_lang$core$Json_Decode$andThen,
						function (path) {
							return A2(
								_elm_lang$core$Json_Decode$andThen,
								function (qs) {
									return A2(
										_elm_lang$core$Json_Decode$andThen,
										function (right) {
											return A2(
												_elm_lang$core$Json_Decode$andThen,
												function (rightName) {
													return _elm_lang$core$Json_Decode$succeed(
														{left: left, leftName: leftName, path: path, qs: qs, right: right, rightName: rightName});
												},
												A2(
													_elm_lang$core$Json_Decode$field,
													'rightName',
													_elm_lang$core$Json_Decode$oneOf(
														{
															ctor: '::',
															_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
															_1: {
																ctor: '::',
																_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$string),
																_1: {ctor: '[]'}
															}
														})));
										},
										A2(_elm_lang$core$Json_Decode$field, 'right', _elm_lang$core$Json_Decode$string));
								},
								A2(_elm_lang$core$Json_Decode$field, 'qs', _elm_lang$core$Json_Decode$string));
						},
						A2(_elm_lang$core$Json_Decode$field, 'path', _elm_lang$core$Json_Decode$string));
				},
				A2(
					_elm_lang$core$Json_Decode$field,
					'leftName',
					_elm_lang$core$Json_Decode$oneOf(
						{
							ctor: '::',
							_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
							_1: {
								ctor: '::',
								_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$string),
								_1: {ctor: '[]'}
							}
						})));
		},
		A2(_elm_lang$core$Json_Decode$field, 'left', _elm_lang$core$Json_Decode$string)));

var Elm = {};
Elm['Main'] = Elm['Main'] || {};
if (typeof _user$project$Main$main !== 'undefined') {
    _user$project$Main$main(Elm['Main'], 'Main', undefined);
}

if (typeof define === "function" && define['amd'])
{
  define([], function() { return Elm; });
  return;
}

if (typeof module === "object")
{
  module['exports'] = Elm;
  return;
}

var globalElm = this['Elm'];
if (typeof globalElm === "undefined")
{
  this['Elm'] = Elm;
  return;
}

for (var publicModule in Elm)
{
  if (publicModule in globalElm)
  {
    throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
  }
  globalElm[publicModule] = Elm[publicModule];
}

}).call(this);


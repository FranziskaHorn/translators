{
	"translatorID": "f16931f0-372e-4197-8927-05d2ba7599d8",
	"label": "Talis Aspire",
	"creator": "Sebastian Karcher",
	"target": "^https?://([^/]+\\.)?(((my)?reading|resource|lib|cyprus|)lists|aspire\\.surrey)\\..+/(lists|items)/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 200,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsbv",
	"lastUpdated": "2014-09-13 22:51:45"
}

/*
	***** BEGIN LICENSE BLOCK *****
	
	Copyright © 2013 Sebastian Karcher 
	This file is part of Zotero.
	
	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	
	You should have received a copy of the GNU Affero General Public License
	along with Zotero.  If not, see <http://www.gnu.org/licenses/>.
	
	***** END LICENSE BLOCK *****
*/

function detectWeb(doc, url) {
	if (url.indexOf('/lists/') != -1 && getSearchResults(doc, true)) return "multiple";
	
	if (url.indexOf('/items/') != -1) {
		var type = ZU.xpathText(doc, '//dd/span[@class="label"]');
		if (type == "Book")	return "book";
		if (type =="Webpage" || type =="Website") return "webpage";
		return "journalArticle";
	}
}

function getSearchResults(doc, checkOnly) {
	var items = {}, found = false;
	var bibData = doc.getElementsByClassName('itemBibData');
	for (var i=0; i<bibData.length; i++) {
		var a = bibData[i].getElementsByTagName('a')[0];
		if (!a) continue;
		
		if (checkOnly) return true;
		found = true;
		items[a.href] = ZU.trimInternal(a.textContent);
	}
	
	return found ? items : false;
}

function doWeb(doc, url) {
	if(detectWeb(doc, url) == "multiple") { 
		Zotero.selectItems(getSearchResults(doc), function (items) {
			if (!items) return true;
			
			var articles = [];
			for (var i in items) {
				articles.push(i);
			}
			scrape(articles)
		});
	} else {
		scrape([url]);
	}
}

function scrape(urls) {
	var url = urls.shift();
	ZU.doGet(url.replace(/\.html.*/, ".ris"), function(text){
		var translator = Zotero.loadTranslator("import");
		// RIS
		translator.setTranslator("32d59d2d-b65a-4da4-b0a3-bdd3cfb979e7");
		translator.setString(text);
		translator.setHandler("itemDone", function(obj, item) {
			item.attachments = [{
				url:url,
				title: "Talis Aspire - Snapshot",
				mimeType: "text/html"
			}];
			item.complete();
		});	
		translator.translate();
	},
	function() { if (urls.length) scrape(urls) });
}/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://lists.library.lincoln.ac.uk/items/FEB50B30-652C-55B2-08F8-F2D399BF308A.html",
		"items": [
			{
				"itemType": "book",
				"title": "American cultural studies: an introduction to American culture",
				"creators": [
					{
						"lastName": "Campbell",
						"firstName": "Neil",
						"creatorType": "author"
					},
					{
						"lastName": "Kean",
						"firstName": "Alasdair",
						"creatorType": "author"
					}
				],
				"date": "2006",
				"ISBN": "0415346665",
				"libraryCatalog": "Talis Aspire",
				"place": "London",
				"publisher": "Routledge",
				"shortTitle": "American cultural studies",
				"attachments": [
					{
						"title": "Talis Aspire - Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [
					{
						"note": "<p>Ebook version of first edition also available</p>"
					}
				],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://lists.library.lincoln.ac.uk/lists/625177C4-A268-8971-E3C9-ACEA91A83585.html",
		"items": "multiple"
	},
	{
		"type": "web",
		"url": "http://lists.library.qmul.ac.uk/lists/34B2A243-2CDC-1F73-D096-997F10E49638.html",
		"items": "multiple"
	},
	{
		"type": "web",
		"url": "http://lists.library.qmul.ac.uk/items/10CFCD91-2171-A947-8436-2189D8DDE5BC.html",
		"items": [
			{
				"itemType": "webpage",
				"title": "The Metaphysical Elements of Ethics by Immanuel Kant (1780)",
				"creators": [],
				"accessDate": "CURRENT_TIMESTAMP",
				"libraryCatalog": "Talis Aspire",
				"url": "http://www.marxists.org/reference/subject/ethics/kant/morals/ch01.htm",
				"attachments": [
					{
						"title": "Talis Aspire - Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://lists.library.qmul.ac.uk/items/66C2A847-80C3-8259-46AB-0DB8C0779068.html",
		"items": [
			{
				"itemType": "journalArticle",
				"title": "The Struggle against Sweatshops: Moving toward Responsible Global Business",
				"creators": [
					{
						"lastName": "Tara J. Radin and Martin Calkins",
						"creatorType": "author",
						"fieldMode": 1
					}
				],
				"date": "Jul., 2006",
				"ISSN": "01674544",
				"issue": "No. 2",
				"libraryCatalog": "Talis Aspire",
				"pages": "261-272",
				"publicationTitle": "Journal of Business Ethics",
				"shortTitle": "The Struggle against Sweatshops",
				"url": "http://www.jstor.org/stable/25123831",
				"volume": "Vol. 66",
				"attachments": [
					{
						"title": "Talis Aspire - Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://readinglists.bournemouth.ac.uk/items/AF2E5676-6A86-DCDC-FC7B-8CC554EFD9BF.html",
		"items": [
			{
				"itemType": "book",
				"title": "The Unified Modeling Language reference manual",
				"creators": [
					{
						"lastName": "Rumbaugh",
						"firstName": "James",
						"creatorType": "author"
					},
					{
						"lastName": "Jacobson",
						"firstName": "Ivar",
						"creatorType": "author"
					},
					{
						"lastName": "Booch",
						"firstName": "Grady",
						"creatorType": "author"
					}
				],
				"date": "0000 c",
				"ISBN": "020130998X",
				"libraryCatalog": "Talis Aspire",
				"place": "Harlow",
				"publisher": "Addison Wesley",
				"volume": "The Addison-Wesley object technology series",
				"attachments": [
					{
						"title": "Talis Aspire - Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://resourcelists.coventry.ac.uk/items/1CC2D394-7EDE-8DE5-4FF0-868C1C6E6BE5.html",
		"items": [
			{
				"itemType": "book",
				"title": "Decision making in midwifery practice",
				"creators": [
					{
						"lastName": "Marshall",
						"firstName": "Jayne E",
						"creatorType": "author"
					},
					{
						"lastName": "Raynor",
						"firstName": "Maureen D",
						"creatorType": "author"
					},
					{
						"lastName": "Sullivan",
						"firstName": "Amanda",
						"creatorType": "author"
					}
				],
				"date": "2005",
				"ISBN": "0443073848",
				"libraryCatalog": "Talis Aspire",
				"place": "Edinburgh",
				"publisher": "Elsevier/Churchill Livingstone",
				"attachments": [
					{
						"title": "Talis Aspire - Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://lists.lib.keele.ac.uk/items/239E38F7-E59C-5121-284A-1520A01AD73D.html",
		"items": [
			{
				"itemType": "bookSection",
				"title": "The Politics of War Memory and Commemoration",
				"creators": [
					{
						"lastName": "Ashplant",
						"firstName": "T.G. Dawson, G. & Roper, M.",
						"creatorType": "author"
					},
					{
						"lastName": "Ashplant",
						"firstName": "T.G.",
						"creatorType": "editor"
					},
					{
						"lastName": "Dawson",
						"firstName": "Graham",
						"creatorType": "editor"
					},
					{
						"lastName": "Roper",
						"firstName": "Michael",
						"creatorType": "editor"
					}
				],
				"date": "2000",
				"ISBN": "0415242614",
				"bookTitle": "The politics of war memory and commemorations",
				"libraryCatalog": "Talis Aspire",
				"place": "London",
				"publisher": "Routledge",
				"attachments": [
					{
						"title": "Talis Aspire - Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://lists.hope.ac.uk/items/381FA0D7-CD14-2AA6-4ACC-1EDCF0A70B64.html",
		"items": [
			{
				"itemType": "book",
				"title": "Versailles and after, 1919-33",
				"creators": [
					{
						"lastName": "Henig",
						"firstName": "Ruth",
						"creatorType": "author"
					}
				],
				"date": "1995",
				"ISBN": "0415127106",
				"libraryCatalog": "Talis Aspire",
				"place": "London",
				"publisher": "Routledge",
				"volume": "Lancaster pamphlets",
				"attachments": [
					{
						"title": "Talis Aspire - Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://cypruslists.central-lancashire.ac.uk/items/57E6E313-82BF-0AF6-C0E5-940A3760507C.html",
		"items": [
			{
				"itemType": "book",
				"title": "Neocleous's introduction to Cyprus law",
				"creators": [
					{
						"lastName": "Neocleous",
						"firstName": "Andreas",
						"creatorType": "author"
					},
					{
						"lastName": "Andreas Neocleous & Co",
						"creatorType": "author",
						"fieldMode": 1
					}
				],
				"date": "2010",
				"ISBN": "9789963935918",
				"libraryCatalog": "Talis Aspire",
				"place": "Limassol, Cyprus",
				"publisher": "A. Neocleous & Co. LLC",
				"attachments": [
					{
						"title": "Talis Aspire - Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://liblists.derby.ac.uk/items/F9F66F67-142C-B05D-7401-22037C676876.html",
		"items": [
			{
				"itemType": "book",
				"title": "Preparing to teach in the lifelong learning sector: the new award",
				"creators": [
					{
						"lastName": "Gravells",
						"firstName": "Ann",
						"creatorType": "author"
					}
				],
				"date": "2012",
				"ISBN": "0857257730",
				"libraryCatalog": "Talis Aspire",
				"place": "London",
				"publisher": "Learning Matters",
				"shortTitle": "Preparing to teach in the lifelong learning sector",
				"attachments": [
					{
						"title": "Talis Aspire - Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [
					{
						"note": "<p>Earlier editions are available in the Library.</p>"
					}
				],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://lancaster.myreadinglists.org/items/3ED977AC-FAFF-5832-77C6-957A3D325268.html",
		"items": [
			{
				"itemType": "book",
				"title": "Design patterns: elements of reusable object-oriented software",
				"creators": [
					{
						"lastName": "Gamma",
						"firstName": "Erich",
						"creatorType": "author"
					}
				],
				"date": "1995",
				"ISBN": "0201633612",
				"libraryCatalog": "Talis Aspire",
				"place": "Reading, Mass",
				"publisher": "Addison-Wesley",
				"shortTitle": "Design patterns",
				"volume": "Addison-Wesley professional computing series",
				"attachments": [
					{
						"title": "Talis Aspire - Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://aspire.surrey.ac.uk/items/F6646FBE-5816-9FE7-AAE0-6EE9C05704A5.html",
		"items": [
			{
				"itemType": "book",
				"title": "Major chemical disasters: medical aspects of managment : proceedings of a meeting arranged by the Section of Occupational Medicine of the Royal Society of Medicine, held in London 21 and 22 February, 1989",
				"creators": [
					{
						"lastName": "Murray",
						"firstName": "Virginia",
						"creatorType": "author"
					},
					{
						"lastName": "Royal Society of Medicine",
						"creatorType": "author",
						"fieldMode": 1
					}
				],
				"date": "1990",
				"ISBN": "1853151041",
				"libraryCatalog": "Talis Aspire",
				"place": "London",
				"publisher": "Royal Society of Medicine Services",
				"shortTitle": "Major chemical disasters",
				"volume": "International congress and symposium series",
				"attachments": [
					{
						"title": "Talis Aspire - Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/

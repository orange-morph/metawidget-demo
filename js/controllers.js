( function() {

	'use strict';

	angular.module( 'app' ).controller( 'demoController', function( $scope ) {

		// Metawidget custom configuration
		$scope.metawidgetConfig = {

			// Configure the metawidget inspector to hide children ids in UI, 
			// and set 'required' fields and data types
           	inspector: new metawidget.inspector.CompositeInspector( [
              	new metawidget.inspector.PropertyTypeInspector(),
              	new metawidget.inspector.JsonSchemaInspector( {
                 	properties: {
                 		firstname: {
                 			required: true,
                 			type: "string"
                 		},
                 		lastname: {
                 			required: true,
                 			type: "string"
                 		},
                 		age: {
                 			required: false,
                 			type: "number"
                 		},
                 		address: {
                 			required: false,
                 			type: "string",
                 		},
                    	children: {
                    		required: true,
                       		items: {
                          		properties: {
                             		id: {
                                		hidden: true
                                 	},
                                 	firstname: {
                                 		required: true,
                                 		type: "string"
                                 	}, 
                                 	age: {
                                 		required: true,
                                 		type: "number"
                                 	}
                                }
                          	}
                        }
                    }
              	} )
        	] ),

			// Custom WidgetBuilder to enable Editable tables of children
			widgetBuilder: new metawidget.widgetbuilder.CompositeWidgetBuilder( [ function( elementName, attributes, mw ) {

				if ( attributes.type === 'array' && !metawidget.util.isTrueOrTrueString( attributes.readOnly ) ) {

					var typeAndNames = metawidget.util.splitPath( mw.path );

					if ( typeAndNames.names === undefined ) {
						typeAndNames.names = [];
					}

					typeAndNames.names.push( attributes.name );
					typeAndNames.names.push( '0' );

					var inspectionResult = mw.inspect( mw.toInspect, typeAndNames.type, typeAndNames.names );
					var inspectionResultProperties = metawidget.util.getSortedInspectionResultProperties( inspectionResult );
					var columns = '';

					for ( var loop = 0, length = inspectionResultProperties.length; loop < length; loop++ ) {

						var columnAttribute = inspectionResultProperties[loop];

						if ( metawidget.util.isTrueOrTrueString( columnAttribute.hidden ) ) {
							continue;
						}

						if ( columns !== '' ) {
							columns += ',';
						}
						columns += columnAttribute.name;
					}

					var widget = $( '<table>' ).attr( 'edit-table', '' ).attr( 'columns', columns ).attr( 'ng-model', mw.path + '.' + attributes.name );
					return widget[0];
				}
			}, new metawidget.widgetbuilder.HtmlWidgetBuilder() ] ),
			addWidgetProcessors: [ new metawidget.bootstrap.widgetprocessor.BootstrapWidgetProcessor() ],
			layout: new metawidget.bootstrap.layout.BootstrapDivLayout()
		}

		// Person Model
		$scope.person = {
           	firstname: '',
           	lastname: '',
           	age: 0,
           	address: '',
           	children: []
        };

        // Array of quotes about the area the person lives in, to be randomly applied in console
        $scope.area = [
        	'Ive heard some bad things about that area...', 
        	'Oh really? How can you afford to live there!', 
        	'Ah, thats just around the corner from where Kevin Rudd used to live!'
        ];

        // Array of quotes about a child's behaviour, to be randomly applied in console
        $scope.behaviour = [
        	'This one is an angel...', 
        	'This one is extremely naughty!', 
        	'This one is cheeky!'
        ];

        // Submit function simply logs marginally humorous things to console
        $scope.submit = function() {
    		console.log("Submitted!");
    		console.log("Thank you, "+$scope.person.firstname+" "+$scope.person.lastname+"!");
    		console.log("----------------------------------------");

    		console.log("You are only "+$scope.person.age+" years young! And you look so much younger!");
    		console.log("----------------------------------------");

    		console.log("Your address is: ");
    		console.log($scope.person.address);
    		let areaIndex = Math.floor((Math.random() * 2));
			console.log($scope.area[areaIndex]);
    		console.log("----------------------------------------");

    		console.log("Your children are: ");
    		console.log("----------------------------------------");
    		$scope.person.children.forEach(function(child) {
				console.log(child.firstname+" who is "+child.age+" years old");
				let behaviourIndex = Math.floor((Math.random() * 2));
				console.log($scope.behaviour[behaviourIndex]);
			});

			console.log("----------------------------------------");
			console.log("Thanks, and enjoy your day!");
		};
			
	} );

} )();
